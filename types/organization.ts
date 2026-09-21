/**
 * Multi-Tenant Organization & Membership Types
 */

import { SystemRoleSlug } from "./rbac";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  currency: string;
  timezone: string;
  taxNumber: string | null; // UAE TRN (Tax Registration Number)
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMembershipSummary {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  currency: string;
  roleId: string;
  roleName: string;
  roleSlug: SystemRoleSlug | string;
  isDefault: boolean;
  joinedAt: string;
}
