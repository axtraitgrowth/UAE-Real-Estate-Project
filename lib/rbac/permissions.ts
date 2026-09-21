import { SystemPermissionCode } from "@/types/rbac";

/**
 * Checks if a list of user permissions includes the required permission code.
 * Supports wildcard matching (e.g., 'org.*' covers 'org.view', 'org.manage').
 */
export function hasPermission(
  userPermissions: string[] | undefined | null,
  requiredPermission: SystemPermissionCode
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;

  const [requiredModule] = requiredPermission.split(".");

  return userPermissions.some((perm) => {
    if (perm === requiredPermission) return true;
    if (perm === "*") return true;
    if (perm === `${requiredModule}.*`) return true;
    return false;
  });
}

/**
 * Checks if user has all requested permissions
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined | null,
  requiredPermissions: SystemPermissionCode[]
): boolean {
  return requiredPermissions.every((perm) => hasPermission(userPermissions, perm));
}

/**
 * Checks if user has at least one of the requested permissions
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  requiredPermissions: SystemPermissionCode[]
): boolean {
  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}
