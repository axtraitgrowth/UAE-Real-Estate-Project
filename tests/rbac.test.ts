import assert from "node:assert/strict";
import { hasPermission, hasAllPermissions, hasAnyPermission } from "../lib/rbac/permissions";
import { SYSTEM_ROLES } from "../config/permissions";

export async function testRbac() {
  console.log("\n▶ Running Suite: RBAC & Permission Foundation Tests");

  const agentPermissions = [
    "org.view",
    "lead.view",
    "lead.create",
    "lead.edit",
    "project.view",
    "unit.view",
    "booking.view",
    "booking.manage",
  ];

  // 1. Direct Permission Checks
  assert.equal(hasPermission(agentPermissions, "lead.view"), true, "Agent should have lead.view");
  assert.equal(hasPermission(agentPermissions, "lead.create"), true, "Agent should have lead.create");
  assert.equal(hasPermission(agentPermissions, "org.manage"), false, "Agent should NOT have org.manage");
  assert.equal(hasPermission(agentPermissions, "org.delete"), false, "Agent should NOT have org.delete");
  console.log("  ✓ Direct permission evaluation verified");

  // 2. Wildcard Module Matching
  const managerWildcardPerms = ["org.view", "lead.*", "project.*"];
  assert.equal(hasPermission(managerWildcardPerms, "lead.delete"), true, "lead.* wildcard should grant lead.delete");
  assert.equal(hasPermission(managerWildcardPerms, "project.manage"), true, "project.* wildcard should grant project.manage");
  assert.equal(hasPermission(managerWildcardPerms, "booking.view"), false, "Wildcard should not leak across modules");
  console.log("  ✓ Wildcard module permission matching verified");

  // 3. Super Wildcard Matching
  const superAdminPerms = ["*"];
  assert.equal(hasPermission(superAdminPerms, "org.delete"), true, "* wildcard should grant all");
  assert.equal(hasPermission(superAdminPerms, "booking.manage"), true, "* wildcard should grant all");
  console.log("  ✓ Global wildcard matching verified");

  // 4. Multiple Permission Combinations
  assert.equal(
    hasAllPermissions(agentPermissions, ["lead.view", "lead.create"]),
    true,
    "hasAllPermissions should return true when all are granted"
  );
  assert.equal(
    hasAllPermissions(agentPermissions, ["lead.view", "org.manage"]),
    false,
    "hasAllPermissions should return false if one is missing"
  );
  assert.equal(
    hasAnyPermission(agentPermissions, ["org.manage", "lead.view"]),
    true,
    "hasAnyPermission should return true if any is present"
  );
  console.log("  ✓ Composite permission verification (hasAll/hasAny) verified");

  // 5. Verify Hierarchy Matrix from Config
  const ownerDef = SYSTEM_ROLES.find((r) => r.slug === "owner")!;
  const adminDef = SYSTEM_ROLES.find((r) => r.slug === "admin")!;

  assert.equal(ownerDef.permissions.includes("org.delete"), true, "Owner must have org.delete");
  assert.equal(adminDef.permissions.includes("org.delete"), false, "Admin must NOT have org.delete");
  console.log("  ✓ System roles matrix integrity verified");
}
