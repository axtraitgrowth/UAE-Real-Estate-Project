import { NextRequest } from "next/server";
import { requireOrgMember } from "@/lib/rbac/guards";
import { ProspectService } from "@/services/prospect.service";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";
import { z } from "zod";
import { validateRequest } from "@/lib/validation/validate";

const duplicateCheckSchema = z.object({
  companyName: z.string().min(2).max(120),
  website: z.string().url().optional().nullable(),
  linkedinCompanyUrl: z.string().url().optional().nullable(),
  businessEmail: z.string().email().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const { session } = await requireOrgMember();
    const body = await request.json();
    const input = await validateRequest(duplicateCheckSchema, body);
    const duplicates = await ProspectService.checkDuplicates(session.currentOrgId, input);
    return apiSuccess({ duplicates, count: duplicates.length });
  } catch (error) {
    return handleApiError(error);
  }
}
