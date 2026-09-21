import { NextRequest } from "next/server";
import { requireOrgMember } from "@/lib/rbac/guards";
import { ProspectService } from "@/services/prospect.service";
import { validateRequest } from "@/lib/validation/validate";
import {
  createProspectSchema,
  prospectFilterSchema,
} from "@/lib/validation/prospect";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

export async function GET(request: NextRequest) {
  try {
    const { session } = await requireOrgMember();

    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      search: searchParams.get("search") || undefined,
      companyType: searchParams.get("companyType") || undefined,
      leadStatus: searchParams.get("leadStatus") || undefined,
      leadScore: searchParams.get("leadScore") || undefined,
      assignedToUserId: searchParams.get("assignedToUserId") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      digitalMaturity: searchParams.get("digitalMaturity") || undefined,
      decisionMakerLevel: searchParams.get("decisionMakerLevel") || undefined,
      outreachReadiness: searchParams.get("outreachReadiness") || undefined,
      evidenceConfidence: searchParams.get("evidenceConfidence") || undefined,
      geographicPriority: searchParams.get("geographicPriority") || undefined,
      hasLandingPage: searchParams.has("hasLandingPage") ? searchParams.get("hasLandingPage") === "true" : undefined,
      hasLeadForm: searchParams.has("hasLeadForm") ? searchParams.get("hasLeadForm") === "true" : undefined,
      hasWhatsappCta: searchParams.has("hasWhatsappCta") ? searchParams.get("hasWhatsappCta") === "true" : undefined,
    };

    const filters = await validateRequest(prospectFilterSchema, rawParams);
    const result = await ProspectService.listProspects(session.currentOrgId, filters);

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await requireOrgMember();

    const body = await request.json();
    const validatedData = await validateRequest(createProspectSchema, body);

    const prospect = await ProspectService.createProspect(
      session.currentOrgId,
      validatedData
    );

    return apiSuccess(prospect, "Prospect created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
