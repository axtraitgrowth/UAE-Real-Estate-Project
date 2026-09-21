import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { ProspectService } from "../services/prospect.service";
import { NotFoundError } from "../lib/errors/app-error";

const prisma = new PrismaClient();

export async function testProspect() {
  console.log("\n▶ Running Suite: Phase 3 Step 1 — Prospect Database Architecture Tests");

  try {
    const emaar = await prisma.organization.findUniqueOrThrow({ where: { slug: "emaar" } });
    const damac = await prisma.organization.findUniqueOrThrow({ where: { slug: "damac" } });
    const managerUser = await prisma.user.findUniqueOrThrow({ where: { email: "manager@emaar.ae" } });

    // Clean up any test artifacts from prior runs
    await prisma.prospect.deleteMany({
      where: {
        companyName: { in: ["Omniyat Properties Test", "Sobha Realty Test", "Ellington Test"] },
      },
    });

    // 1. Prospect Creation with All 4 Dimensions
    const omniyat = await ProspectService.createProspect(emaar.id, {
      companyName: "Omniyat Properties Test",
      companyType: "DEVELOPER",
      website: "https://www.omniyat.com",
      location: "Business Bay, Dubai, UAE",
      companySize: "51-200",
      primaryMarket: "Ultra-Luxury Waterfront",
      propertySegment: "Ultra-Luxury",
      activeProjects: "The Lana Residences, One at Palm Jumeirah",
      companyNotes: "Specializes in iconic architecture and high-ticket penthouses",

      contactName: "Mahdi Amjad",
      jobTitle: "Executive Chairman",
      businessEmail: "m.amjad@omniyat-test.ae",
      businessPhone: "+971 4 511 5000",
      preferredContactChannel: "LINKEDIN",
      contactSource: "DLD Registry",

      websiteQuality: "EXCELLENT",
      leadFunnelQuality: "BASIC",
      hasLandingPage: true,
      hasLeadForm: true,
      hasWhatsappCta: false,
      visibleAdActivity: "META_AND_GOOGLE",
      crmVisibility: "DETECTED",
      marketingObservation: "Heavy branding spend but paid search leads land on general portal",
      personalizedOpportunity: "Implement dedicated ultra-luxury landing pages and instant WhatsApp qualification",

      leadScore: "HIGH",
      leadScorePoints: 92,
      leadStatus: "RESEARCHED",
      outreachChannel: "LINKEDIN",
      dealValue: 75000,
      salesNotes: "Targeting launch of new Marasi Bay project",
      assignedToUserId: managerUser.id,
    });

    assert.ok(omniyat.id, "Prospect should receive an ID");
    assert.equal(omniyat.companyName, "Omniyat Properties Test");
    assert.equal(omniyat.companyType, "DEVELOPER");
    assert.equal(omniyat.propertySegment, "Ultra-Luxury");
    assert.equal(omniyat.contactName, "Mahdi Amjad");
    assert.equal(omniyat.leadScore, "HIGH");
    assert.equal(omniyat.dealValue, 75000);
    assert.equal(omniyat.assignedTo?.id, managerUser.id);
    // Step 2 Qualification assertions
    assert.equal(omniyat.icpFitScore, 30, "Developer should receive 30 ICP fit points");
    assert.equal(omniyat.marketFitScore, 15, "Dubai location should receive 15 market points");
    assert(omniyat.leadScorePoints >= 80, "Omniyat should have >=80 lead score points");
    assert.equal(omniyat.outreachReadiness, "READY", "Researched prospect with DM should be outreach READY");
    console.log("  ✓ Prospect created with complete 4-domain intelligence & 100-pt qualification score");

    // 2. Duplicate Detection Test
    const dups = await ProspectService.checkDuplicates(emaar.id, {
      companyName: "Omniyat Properties Test",
      website: "https://www.omniyat.com",
    });
    assert.ok(dups.length >= 1, "Duplicate detection should identify matching company name");
    assert.equal(dups[0].id, omniyat.id);
    console.log("  ✓ Duplicate detection engine verified (detected matching company name & domain)");

    // 3. Recalculate Score Test
    const recalc = await ProspectService.recalculateScore(emaar.id, omniyat.id);
    assert.ok(recalc.breakdown.total >= 80, "Recalculated score total should be >= 80");
    assert.equal(recalc.breakdown.priority, "HIGH");
    assert.ok(recalc.breakdown.reasons.length > 0);
    console.log("  ✓ Score recalculation service verified with auditable breakdown");

    // 4. Fetch By ID & Update
    const fetched = await ProspectService.getProspectById(emaar.id, omniyat.id);
    assert.equal(fetched.id, omniyat.id);

    const updated = await ProspectService.updateProspect(emaar.id, omniyat.id, {
      leadStatus: "CONTACTED",
      firstContactDate: new Date("2026-03-15"),
      salesNotes: "LinkedIn outreach connection request accepted by EA",
    });
    assert.equal(updated.leadStatus, "CONTACTED");
    assert.ok(updated.salesNotes?.includes("LinkedIn outreach"));
    console.log("  ✓ Prospect retrieval and telemetry update verified");

    // 3. Multi-Tenant Boundary Isolation Test
    // Damac must NOT be able to find, update, or list Emaar's prospect
    let crossTenantFetchFailed = false;
    try {
      await ProspectService.getProspectById(damac.id, omniyat.id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        crossTenantFetchFailed = true;
      }
    }
    assert.equal(crossTenantFetchFailed, true, "Cross-tenant prospect fetch MUST throw NotFoundError");

    let crossTenantUpdateFailed = false;
    try {
      await ProspectService.updateProspect(damac.id, omniyat.id, {
        companyName: "Breach Attempt",
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        crossTenantUpdateFailed = true;
      }
    }
    assert.equal(crossTenantUpdateFailed, true, "Cross-tenant prospect update MUST throw NotFoundError");

    // Check Damac prospect list does not include Emaar prospect
    const damacList = await ProspectService.listProspects(damac.id);
    assert.equal(
      damacList.prospects.some((p) => p.id === omniyat.id),
      false,
      "Damac tenant list MUST NOT leak Emaar prospects"
    );
    console.log("  ✓ Strict multi-tenant isolation enforced on prospects");

    // 4. Filtering and Search
    const searchResult = await ProspectService.listProspects(emaar.id, {
      search: "Omniyat",
      companyType: "DEVELOPER",
      leadScore: "HIGH",
    });
    assert.ok(searchResult.total >= 1, "Should find prospect by search term and filters");
    assert.equal(searchResult.prospects[0].id, omniyat.id);
    console.log("  ✓ Search query and attribute filters verified");

    // 5. Aggregate Stats Verification
    const stats = await ProspectService.getProspectStats(emaar.id);
    assert.ok(stats.totalProspects >= 1);
    assert.ok(stats.developersCount >= 1);
    assert.ok(stats.hotLeadsCount >= 1);
    assert.ok(stats.totalPipelineValueAed >= 75000);
    console.log("  ✓ Real-time prospect metrics aggregation verified");

    // 6. Cleanup
    await ProspectService.deleteProspect(emaar.id, omniyat.id);
    let deletedCheck = false;
    try {
      await ProspectService.getProspectById(emaar.id, omniyat.id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        deletedCheck = true;
      }
    }
    assert.equal(deletedCheck, true, "Deleted prospect should no longer be retrievable");
    console.log("  ✓ Prospect deletion and audit cleanup verified");
  } finally {
    await prisma.$disconnect();
  }
}
