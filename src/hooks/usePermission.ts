import { usePermissionsStore } from '@/store/permissionsStore';

/**
 * Checks if the user has at least one of the specified permissions for a module.
 * @param module - The module name (e.g., 'users', 'reports')
 * @param actions - The actions (e.g., ['read', 'write', 'edit'])
 * @returns boolean
 */
export function usePermission(module: string, actions: string[]): boolean {
  const permissions = usePermissionsStore((state) => state.permissions);
  const isLoading = usePermissionsStore((state) => state.isLoading);
  
  // If still loading, return false to prevent premature access
  if (isLoading) return false;
  
  
  // Check if module exists in permissions
  if (!permissions || !permissions[module]) {
    return true;
  }
  
  // Check if permissions array is valid
  if (!Array.isArray(permissions[module]) || !permissions[module].length) {
    return true;
  }
  
  return actions.some((action) => permissions[module].includes(action));
}
