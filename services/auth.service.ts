import { prisma } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSessionToken } from "@/lib/auth/session";
import { AuthenticationError, NotFoundError, TenantIsolationError } from "@/lib/errors/app-error";
import { LoginInput } from "@/lib/validation/schemas";
import { AuthenticatedUser } from "@/types/auth";
import { SystemPermissionCode, SystemRoleSlug } from "@/types/rbac";

export class AuthService {
  /**
   * Authenticates user, resolves their primary organization membership,
   * updates last login, and returns a signed session token.
   */
  static async login(credentials: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            organization: true,
            role: true,
          },
          where: {
            organization: { isActive: true },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!isValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (user.memberships.length === 0) {
      throw new AuthenticationError("User is not associated with any active organization");
    }

    // Default to the default membership or the first active membership
    const activeMembership = user.memberships.find((m) => m.isDefault) || user.memberships[0];

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      currentOrgId: activeMembership.organizationId,
      roleId: activeMembership.roleId,
      roleSlug: activeMembership.role.slug,
    });

    return { token, userId: user.id, organizationId: activeMembership.organizationId };
  }

  /**
   * Retrieves full profile, active organization details, permissions, and available memberships.
   */
  static async getCurrentUser(userId: string, currentOrgId: string): Promise<AuthenticatedUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
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
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new NotFoundError("User not found or account is deactivated");
    }

    const currentMembership = user.memberships.find((m) => m.organizationId === currentOrgId);
    if (!currentMembership || !currentMembership.organization.isActive) {
      throw new TenantIsolationError("No active access to the specified organization");
    }

    const permissions = currentMembership.role.permissions.map(
      (rp) => rp.permission.code as SystemPermissionCode
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isSuperAdmin: user.isSuperAdmin,
      currentOrganization: {
        id: currentMembership.organization.id,
        name: currentMembership.organization.name,
        slug: currentMembership.organization.slug,
        logoUrl: currentMembership.organization.logoUrl,
        currency: currentMembership.organization.currency,
        timezone: currentMembership.organization.timezone,
        taxNumber: currentMembership.organization.taxNumber,
        phone: currentMembership.organization.phone,
        address: currentMembership.organization.address,
        isActive: currentMembership.organization.isActive,
        createdAt: currentMembership.organization.createdAt.toISOString(),
        updatedAt: currentMembership.organization.updatedAt.toISOString(),
      },
      currentRole: {
        id: currentMembership.role.id,
        name: currentMembership.role.name,
        slug: currentMembership.role.slug as SystemRoleSlug,
        permissions,
      },
      memberships: user.memberships
        .filter((m) => m.organization.isActive)
        .map((m) => ({
          id: m.id,
          organizationId: m.organization.id,
          organizationName: m.organization.name,
          organizationSlug: m.organization.slug,
          currency: m.organization.currency,
          roleId: m.role.id,
          roleName: m.role.name,
          roleSlug: m.role.slug,
          isDefault: m.isDefault,
          joinedAt: m.joinedAt.toISOString(),
        })),
    };
  }

  /**
   * Switches active tenant organization context for the authenticated user.
   */
  static async switchOrganization(userId: string, targetOrgId: string) {
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: targetOrgId,
          userId,
        },
      },
      include: {
        organization: true,
        role: true,
        user: true,
      },
    });

    if (!membership || !membership.organization.isActive) {
      throw new TenantIsolationError("You do not have active access to this organization");
    }

    const token = await createSessionToken({
      userId: membership.userId,
      email: membership.user.email,
      currentOrgId: membership.organizationId,
      roleId: membership.roleId,
      roleSlug: membership.role.slug,
    });

    return { token, organizationId: targetOrgId };
  }
}
