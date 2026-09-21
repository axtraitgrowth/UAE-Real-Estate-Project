import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/rbac/guards";
import { AuthService } from "@/services/auth.service";
import { validateRequest } from "@/lib/validation/validate";
import { switchOrgSchema } from "@/lib/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";
import { getSessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { organizationId } = await validateRequest(switchOrgSchema, body);

    const { token } = await AuthService.switchOrganization(session.userId, organizationId);
    const updatedUser = await AuthService.getCurrentUser(session.userId, organizationId);

    const response = apiSuccess(updatedUser, "Switched workspace successfully");
    const cookieOpts = getSessionCookieOptions();

    response.cookies.set(cookieOpts.name, token, cookieOpts);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
