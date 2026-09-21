import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "../services/auth.service";
import { OrganizationService } from "../services/organization.service";
import { TenantIsolationError } from "../lib/errors/app-error";

const prisma = new PrismaClient();

export async function testIsolation() {
  console.log("\n▶ Running Suite: Multi-Tenant Organization Boundary Isolation Tests");

  try {
    const emaar = await prisma.organization.findUniqueOrThrow({ where: { slug: "emaar" } });
    const damac = await prisma.organization.findUniqueOrThrow({ where: { slug: "damac" } });
    const managerUser = await prisma.user.findUniqueOrThrow({ where: { email: "manager@emaar.ae" } });
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: "owner@emaar.ae" } });

    // 1. Authorized Tenant Context
    const managerEmaarProfile = await AuthService.getCurrentUser(managerUser.id, emaar.id);
    assert.equal(managerEmaarProfile.currentOrganization.id, emaar.id, "Manager should resolve Emaar context");
    assert.equal(managerEmaarProfile.currentRole.slug, "sales_manager", "Manager should have sales_manager role in Emaar");
    console.log("  ✓ Authorized tenant resolution verified");

    // 2. Cross-Tenant Access Denial
    let denied = false;
    try {
      // Sarah belongs only to Emaar, trying to access Damac must throw TenantIsolationError
      await AuthService.getCurrentUser(managerUser.id, damac.id);
    } catch (err) {
      if (err instanceof TenantIsolationError) {
        denied = true;
      }
    }
    assert.equal(denied, true, "Accessing an unassociated organization MUST throw TenantIsolationError");

    let switchDenied = false;
    try {
      await AuthService.switchOrganization(managerUser.id, damac.id);
    } catch (err) {
      if (err instanceof TenantIsolationError) {
        switchDenied = true;
      }
    }
    assert.equal(switchDenied, true, "Switching to an unassociated organization MUST throw TenantIsolationError");
    console.log("  ✓ Cross-tenant boundary breach protection verified");

    // 3. Multi-Tenant Dual Membership Context Switching
    // Tariq belongs to Emaar (as Owner) and Damac (as Admin)
    const tariqEmaar = await AuthService.getCurrentUser(ownerUser.id, emaar.id);
    assert.equal(tariqEmaar.currentOrganization.slug, "emaar", "Tariq in Emaar has Emaar slug");
    assert.equal(tariqEmaar.currentRole.slug, "owner", "Tariq role in Emaar is Owner");

    const tariqDamac = await AuthService.getCurrentUser(ownerUser.id, damac.id);
    assert.equal(tariqDamac.currentOrganization.slug, "damac", "Tariq in Damac has Damac slug");
    assert.equal(tariqDamac.currentRole.slug, "admin", "Tariq role in Damac is Admin");
    console.log("  ✓ Multi-tenant dual membership role switching verified");

    // 4. Organization Service Overview Stats
    const emaarStats = await OrganizationService.getOverviewStats(emaar.id);
    assert.ok(emaarStats.membersCount >= 3, "Emaar should have at least 3 members");
    assert.ok(emaarStats.teamsCount >= 2, "Emaar should have at least 2 teams");
    console.log("  ✓ Organization stats isolation verified");
  } finally {
    await prisma.$disconnect();
  }
}
