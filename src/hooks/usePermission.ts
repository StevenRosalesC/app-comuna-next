import { usePermissionsStore } from '@/store/permissionsStore';

/**
 * Checks if the user has a specific permission for a module and action.
 * @param module - The module name (e.g., 'users', 'reports')
 * @param action - The action (e.g., 'read', 'write', 'edit')
 * @returns boolean
 */
export function usePermission(module: string, action: string): boolean {
  const permissions = usePermissionsStore((state) => state.permissions);
  if (!permissions) return false;
  return Array.isArray(permissions[module]) && permissions[module].includes(action);
} 