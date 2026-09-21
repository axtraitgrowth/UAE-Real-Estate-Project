import { NextRequest } from "next/server";
import { requireOrgMember, requirePermission } from "@/lib/rbac/guards";
import { OrganizationService } from "@/services/organization.service";
import { validateRequest } from "@/lib/validation/validate";
import { updateOrganizationSchema } from "@/lib/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Enforce tenant boundary: user must be a member of this organization
    await requireOrgMember(id);

    const organization = await OrganizationService.getById(id);
    const stats = await OrganizationService.getOverviewStats(id);

    return apiSuccess({ organization, stats });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Enforce role permission: user must have org.manage permission in this organization
    await requirePermission("org.manage", id);

    const body = await request.json();
    const validatedData = await validateRequest(updateOrganizationSchema, body);

    const updated = await OrganizationService.update(id, validatedData);
    return apiSuccess(updated, "Organization updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
