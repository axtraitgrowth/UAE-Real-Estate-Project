/**
 * Authentication and Session Types
 */

import { OrganizationMembershipSummary, OrganizationSummary } from "./organization";
import { SystemPermissionCode, SystemRoleSlug } from "./rbac";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  currentOrganization: OrganizationSummary;
  currentRole: {
    id: string;
    name: string;
    slug: SystemRoleSlug | string;
    permissions: SystemPermissionCode[];
  };
  memberships: OrganizationMembershipSummary[];
}

export interface SessionPayload {
  userId: string;
  email: string;
  currentOrgId: string;
  roleId: string;
  roleSlug: string;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
