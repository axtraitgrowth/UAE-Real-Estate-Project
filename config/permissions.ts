import { PermissionDefinition, RoleDefinition, SystemPermissionCode } from "@/types/rbac";

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  // Organization
  {
    code: "org.view",
    module: "organization",
    name: "View Organization",
    description: "View organization profile, settings, and business details",
  },
  {
    code: "org.manage",
    module: "organization",
    name: "Manage Organization",
    description: "Update organization settings, TRN, contact details, and currency",
  },
  {
    code: "org.delete",
    module: "organization",
    name: "Delete Organization",
    description: "Permanently delete the organization workspace and associated records",
  },

  // Users & Memberships
  {
    code: "user.view",
    module: "user",
    name: "View Users",
    description: "View team members and user profiles within the organization",
  },
  {
    code: "user.invite",
    module: "user",
    name: "Invite Users",
    description: "Invite new agents and team members to the organization",
  },
  {
    code: "user.manage",
    module: "user",
    name: "Manage Users",
    description: "Update user status, roles, and assignments",
  },
  {
    code: "user.delete",
    module: "user",
    name: "Remove Users",
    description: "Remove users from the organization",
  },

  // Teams
  {
    code: "team.view",
    module: "team",
    name: "View Teams",
    description: "View sales teams and department structures",
  },
  {
    code: "team.manage",
    module: "team",
    name: "Manage Teams",
    description: "Create, assign, and organize sales teams and team leaders",
  },

  // Roles & Permissions
  {
    code: "role.view",
    module: "role",
    name: "View Roles",
    description: "Inspect role hierarchies and permission assignments",
  },
  {
    code: "role.manage",
    module: "role",
    name: "Manage Roles",
    description: "Configure custom roles and assign granular permissions",
  },

  // Leads (Phase 3 Foundation)
  {
    code: "lead.view",
    module: "lead",
    name: "View Leads",
    description: "View incoming buyer and investor leads in the organization",
  },
  {
    code: "lead.create",
    module: "lead",
    name: "Create Leads",
    description: "Register new investor and property buyer leads",
  },
  {
    code: "lead.edit",
    module: "lead",
    name: "Edit Leads",
    description: "Update lead qualification, budget, notes, and requirements",
  },
  {
    code: "lead.delete",
    module: "lead",
    name: "Delete Leads",
    description: "Archive or remove invalid lead records",
  },
  {
    code: "lead.assign",
    module: "lead",
    name: "Assign Leads",
    description: "Assign leads to sales agents, team leaders, or brokers",
  },

  // Projects (Phase 5 Foundation)
  {
    code: "project.view",
    module: "project",
    name: "View Projects",
    description: "View real estate developments, off-plan projects, and towers",
  },
  {
    code: "project.manage",
    module: "project",
    name: "Manage Projects",
    description: "Configure new developments, master developers, and project media",
  },

  // Units & Inventory (Phase 5 Foundation)
  {
    code: "unit.view",
    module: "unit",
    name: "View Inventory Units",
    description: "Browse unit listings, floorplans, prices, and availability",
  },
  {
    code: "unit.manage",
    module: "unit",
    name: "Manage Inventory Units",
    description: "Add, block, release, and price property units",
  },

  // Bookings & Deals (Phase 6 Foundation)
  {
    code: "booking.view",
    module: "booking",
    name: "View Bookings",
    description: "View sales reservations, EOIs, and SPA contracts",
  },
  {
    code: "booking.manage",
    module: "booking",
    name: "Manage Bookings",
    description: "Issue unit booking tokens, approve deals, and process payments",
  },

  // Reports (Phase 8 Foundation)
  {
    code: "report.view",
    module: "report",
    name: "View Reports & Supervision",
    description: "Access executive reports, agent performance, and conversion analytics",
  },

  // Audit Logs (Phase 11 Foundation)
  {
    code: "audit.view",
    module: "audit",
    name: "View Audit Logs",
    description: "Review system security logs, action histories, and compliance trails",
  },
];

const ALL_PERMISSION_CODES: SystemPermissionCode[] = SYSTEM_PERMISSIONS.map((p) => p.code);

export const SYSTEM_ROLES: RoleDefinition[] = [
  {
    slug: "owner",
    name: "Owner / Master Developer",
    description: "Complete ownership authority over the organization, billing, team structure, and data isolation.",
    isSystem: true,
    permissions: ALL_PERMISSION_CODES,
  },
  {
    slug: "admin",
    name: "Administrator",
    description: "Operational management authority across the entire organization except workspace deletion.",
    isSystem: true,
    permissions: ALL_PERMISSION_CODES.filter((code) => code !== "org.delete"),
  },
  {
    slug: "sales_manager",
    name: "Sales Director / Manager",
    description: "Supervises all sales teams, lead assignments, bookings, inventory, and executive reports.",
    isSystem: true,
    permissions: [
      "org.view",
      "user.view",
      "team.view",
      "team.manage",
      "role.view",
      "lead.view",
      "lead.create",
      "lead.edit",
      "lead.assign",
      "project.view",
      "project.manage",
      "unit.view",
      "unit.manage",
      "booking.view",
      "booking.manage",
      "report.view",
      "audit.view",
    ],
  },
  {
    slug: "team_leader",
    name: "Sales Team Leader",
    description: "Oversees a designated team of property sales agents, monitors follow-ups and deals.",
    isSystem: true,
    permissions: [
      "org.view",
      "user.view",
      "team.view",
      "lead.view",
      "lead.create",
      "lead.edit",
      "lead.assign",
      "project.view",
      "unit.view",
      "booking.view",
      "booking.manage",
      "report.view",
    ],
  },
  {
    slug: "agent",
    name: "Real Estate Agent / Broker",
    description: "Frontline sales agent managing assigned investor leads, site visits, and booking submissions.",
    isSystem: true,
    permissions: [
      "org.view",
      "lead.view",
      "lead.create",
      "lead.edit",
      "project.view",
      "unit.view",
      "booking.view",
      "booking.manage",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing & Growth",
    description: "Supervises lead acquisition channels, portal integrations, campaign sources, and attribution reports.",
    isSystem: true,
    permissions: [
      "org.view",
      "lead.view",
      "lead.create",
      "project.view",
      "unit.view",
      "report.view",
    ],
  },
  {
    slug: "telecaller",
    name: "Telecaller / Qualifier",
    description: "Conducts initial outbound/inbound qualification calls and logs buyer intent.",
    isSystem: true,
    permissions: [
      "org.view",
      "lead.view",
      "lead.create",
      "lead.edit",
      "project.view",
      "unit.view",
    ],
  },
];
