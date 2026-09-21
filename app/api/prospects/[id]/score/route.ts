import { NextRequest } from "next/server";
import { requireOrgMember } from "@/lib/rbac/guards";
import { ProspectService } from "@/services/prospect.service";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session } = await requireOrgMember();
    const { id } = await params;
    const prospect = await ProspectService.getProspectById(session.currentOrgId, id);
    const breakdown = ProspectService.getScoreBreakdown(prospect as Parameters<typeof ProspectService.getScoreBreakdown>[0]);
    return apiSuccess({ breakdown, prospectId: id });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session } = await requireOrgMember();
    const { id } = await params;
    const result = await ProspectService.recalculateScore(session.currentOrgId, id);
    return apiSuccess(result, "Score recalculated");
  } catch (error) {
    return handleApiError(error);
  }
}
