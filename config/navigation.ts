export interface NavigationItem {
  name: string;
  href: string;
  iconName: string;
  badge?: string;
  isPhaseDisabled?: boolean;
  phaseNote?: string;
  permission?: string;
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

export const MAIN_NAVIGATION: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        iconName: "LayoutDashboard",
        isPhaseDisabled: false,
      },
    ],
  },
  {
    title: "Sales Supervision",
    items: [
      {
        name: "Prospect Engine",
        href: "/prospects",
        iconName: "Target",
        badge: "Phase 3",
        isPhaseDisabled: false,
        permission: "lead.view",
      },
      {
        name: "Leads",
        href: "/leads",
        iconName: "UserPlus",
        isPhaseDisabled: true,
        phaseNote: "Phase 3",
        permission: "lead.view",
      },
      {
        name: "Customers",
        href: "/customers",
        iconName: "Users",
        isPhaseDisabled: true,
        phaseNote: "Phase 6",
      },
      {
        name: "Tasks & Follow-ups",
        href: "/tasks",
        iconName: "CheckSquare",
        isPhaseDisabled: true,
        phaseNote: "Phase 4",
      },
      {
        name: "Site Visits",
        href: "/site-visits",
        iconName: "Compass",
        isPhaseDisabled: true,
        phaseNote: "Phase 4",
      },
    ],
  },
  {
    title: "Property & Inventory",
    items: [
      {
        name: "Projects",
        href: "/projects",
        iconName: "Building2",
        isPhaseDisabled: true,
        phaseNote: "Phase 5",
        permission: "project.view",
      },
      {
        name: "Units & Inventory",
        href: "/inventory",
        iconName: "Layers",
        isPhaseDisabled: true,
        phaseNote: "Phase 5",
        permission: "unit.view",
      },
      {
        name: "Bookings & Deals",
        href: "/bookings",
        iconName: "BadgePercent",
        isPhaseDisabled: true,
        phaseNote: "Phase 6",
        permission: "booking.view",
      },
    ],
  },
  {
    title: "Organization & Operations",
    items: [
      {
        name: "Team Management",
        href: "/team",
        iconName: "UserCheck",
        isPhaseDisabled: true,
        phaseNote: "Phase 2",
        permission: "team.view",
      },
      {
        name: "Supervision Reports",
        href: "/reports",
        iconName: "BarChart3",
        isPhaseDisabled: true,
        phaseNote: "Phase 8",
        permission: "report.view",
      },
      {
        name: "Settings",
        href: "/settings",
        iconName: "Settings",
        isPhaseDisabled: false,
        permission: "org.view",
      },
    ],
  },
];
