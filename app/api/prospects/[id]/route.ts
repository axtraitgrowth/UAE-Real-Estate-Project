import { NextRequest } from "next/server";
import { requireOrgMember } from "@/lib/rbac/guards";
import { ProspectService } from "@/services/prospect.service";
import { validateRequest } from "@/lib/validation/validate";
import { updateProspectSchema } from "@/lib/validation/prospect";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { session } = await requireOrgMember();

    const prospect = await ProspectService.getProspectById(session.currentOrgId, id);
    return apiSuccess(prospect);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { session } = await requireOrgMember();

    const body = await request.json();
    const validatedData = await validateRequest(updateProspectSchema, body);

    const updated = await ProspectService.updateProspect(
      session.currentOrgId,
      id,
      validatedData
    );

    return apiSuccess(updated, "Prospect updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { session } = await requireOrgMember();

    await ProspectService.deleteProspect(session.currentOrgId, id);
    return apiSuccess({ deleted: true }, "Prospect deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
