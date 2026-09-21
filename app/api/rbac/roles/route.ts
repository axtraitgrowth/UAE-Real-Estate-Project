import { requireOrgMember } from "@/lib/rbac/guards";
import { RbacService } from "@/services/rbac.service";
import { apiSuccess, handleApiError } from "@/lib/errors/handler";

export async function GET() {
  try {
    const { organization } = await requireOrgMember();
    const roles = await RbacService.getRoles(organization.id);
    const { all: permissions, grouped } = await RbacService.getAllPermissions();

    return apiSuccess({
      roles,
      permissions,
      groupedPermissions: grouped,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
