import { NextRequest } from "next/server";
import { AuthService } from "@/services/auth.service";
import { validateRequest } from "@/lib/validation/validate";
import { loginSchema } from "@/lib/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";
import { getSessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = await validateRequest(loginSchema, body);

    const { token, userId, organizationId } = await AuthService.login(validatedData);
    const user = await AuthService.getCurrentUser(userId, organizationId);

    const response = apiSuccess(user, "Logged in successfully");
    const cookieOpts = getSessionCookieOptions();

    response.cookies.set(cookieOpts.name, token, cookieOpts);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
