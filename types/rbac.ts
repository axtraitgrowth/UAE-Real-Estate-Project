/**
 * Role-Based Access Control (RBAC) Type Definitions
 */

export type SystemRoleSlug =
  | "owner"
  | "admin"
  | "sales_manager"
  | "team_leader"
  | "agent"
  | "marketing"
  | "telecaller";

export type PermissionModule =
  | "organization"
  | "user"
  | "team"
  | "role"
  | "lead"
  | "project"
  | "unit"
  | "booking"
  | "report"
  | "audit";

export type SystemPermissionCode =
  // Organization
  | "org.view"
  | "org.manage"
  | "org.delete"
  // Users & Memberships
  | "user.view"
  | "user.invite"
  | "user.manage"
  | "user.delete"
  // Teams
  | "team.view"
  | "team.manage"
  // Roles & Permissions
  | "role.view"
  | "role.manage"
  // Leads (Phase 3 Foundation)
  | "lead.view"
  | "lead.create"
  | "lead.edit"
  | "lead.delete"
  | "lead.assign"
  // Projects (Phase 5 Foundation)
  | "project.view"
  | "project.manage"
  // Units & Inventory (Phase 5 Foundation)
  | "unit.view"
  | "unit.manage"
  // Bookings & Deals (Phase 6 Foundation)
  | "booking.view"
  | "booking.manage"
  // Reports (Phase 8 Foundation)
  | "report.view"
  // Audit Logs (Phase 11 Foundation)
  | "audit.view";

export interface PermissionDefinition {
  code: SystemPermissionCode;
  module: PermissionModule;
  name: string;
  description: string;
}

export interface RoleDefinition {
  slug: SystemRoleSlug;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: SystemPermissionCode[];
}
