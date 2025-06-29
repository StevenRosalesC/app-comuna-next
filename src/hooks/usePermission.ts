import { usePermissionsStore } from '@/store/permissionsStore';

/**
 * Checks if the user has at least one of the specified permissions for a module.
 * @param module - The module name (e.g., 'users', 'reports')
 * @param actions - The actions (e.g., ['read', 'write', 'edit'])
 * @returns boolean
 */
export function usePermission(module: string, actions: string[]): boolean {
  const permissions = usePermissionsStore((state) => state.permissions);
  if (!permissions) return false;
  if (!Array.isArray(permissions[module])) return false;
  return actions.some((action) => permissions[module].includes(action));
}
