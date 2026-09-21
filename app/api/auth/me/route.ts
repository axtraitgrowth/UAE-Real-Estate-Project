import { getServerSession } from "@/lib/auth/session";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";
import { AuthenticationError } from "@/lib/errors/app-error";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new AuthenticationError("No active session");
    }

    const user = await AuthService.getCurrentUser(session.userId, session.currentOrgId);
    return apiSuccess(user);
  } catch (error) {
    return handleApiError(error);
  }
}
