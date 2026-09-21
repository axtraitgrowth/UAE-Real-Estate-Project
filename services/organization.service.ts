import { prisma } from "@/lib/db/client";
import { NotFoundError } from "@/lib/errors/app-error";
import { UpdateOrganizationInput } from "@/lib/validation/schemas";
import { OrganizationSummary } from "@/types/organization";

export class OrganizationService {
  /**
   * Retrieves organization by ID with tenant guard
   */
  static async getById(id: string): Promise<OrganizationSummary> {
    const org = await prisma.organization.findUnique({
      where: { id },
    });

    if (!org) {
      throw new NotFoundError("Organization");
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      currency: org.currency,
      timezone: org.timezone,
      taxNumber: org.taxNumber,
      phone: org.phone,
      address: org.address,
      isActive: org.isActive,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  /**
   * Updates organization settings
   */
  static async update(id: string, data: UpdateOrganizationInput): Promise<OrganizationSummary> {
    const updated = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone ?? undefined,
        address: data.address ?? undefined,
        taxNumber: data.taxNumber ?? undefined,
        currency: data.currency,
        timezone: data.timezone,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      logoUrl: updated.logoUrl,
      currency: updated.currency,
      timezone: updated.timezone,
      taxNumber: updated.taxNumber,
      phone: updated.phone,
      address: updated.address,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  /**
   * Count tenant statistics (Teams, members) for dashboard overview
   */
  static async getOverviewStats(organizationId: string) {
    const [membersCount, teamsCount] = await Promise.all([
      prisma.organizationMembership.count({
        where: { organizationId },
      }),
      prisma.team.count({
        where: { organizationId },
      }),
    ]);

    return {
      membersCount,
      teamsCount,
    };
  }
}
