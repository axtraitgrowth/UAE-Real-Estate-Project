import { prisma } from "@/lib/db/client";

export class RbacService {
  /**
   * Retrieves all roles (system + organization-specific) along with their permissions.
   */
  static async getRoles(organizationId?: string) {
    return prisma.role.findMany({
      where: {
        OR: [
          { isSystem: true },
          ...(organizationId ? [{ organizationId }] : []),
        ],
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Retrieves all available system permissions grouped by module.
   */
  static async getAllPermissions() {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { code: "asc" }],
    });

    const grouped: Record<string, typeof permissions> = {};
    for (const p of permissions) {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(p);
    }

    return {
      all: permissions,
      grouped,
    };
  }
}
