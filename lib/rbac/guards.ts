import { getServerSession } from "@/lib/auth/session";
import { AuthenticationError, AuthorizationError, TenantIsolationError } from "@/lib/errors/app-error";
import { prisma } from "@/lib/db/client";
import { hasPermission } from "./permissions";
import { SystemPermissionCode } from "@/types/rbac";

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new AuthenticationError("You must be logged in to perform this action");
  }
  return session;
}

export async function requireOrgMember(targetOrgId?: string) {
  const session = await requireAuth();
  const orgId = targetOrgId || session.currentOrgId;

  const membership = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: session.userId,
      },
    },
    include: {
      organization: true,
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
      user: true,
    },
  });

  if (!membership || !membership.organization.isActive) {
    throw new TenantIsolationError("You do not have access to this organization or it has been deactivated");
  }

  const permissions = membership.role.permissions.map((rp) => rp.permission.code);

  return {
    session,
    membership,
    organization: membership.organization,
    role: membership.role,
    user: membership.user,
    permissions,
  };
}

export async function requirePermission(permission: SystemPermissionCode, targetOrgId?: string) {
  const context = await requireOrgMember(targetOrgId);

  if (!hasPermission(context.permissions, permission)) {
    throw new AuthorizationError(`Missing required permission: ${permission}`);
  }

  return context;
}
