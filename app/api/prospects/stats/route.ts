import { NextRequest } from "next/server";
import { requireOrgMember } from "@/lib/rbac/guards";
import { ProspectService } from "@/services/prospect.service";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

export async function GET(request: NextRequest) {
  try {
    const { session } = await requireOrgMember();

    const stats = await ProspectService.getProspectStats(session.currentOrgId);
    return apiSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
