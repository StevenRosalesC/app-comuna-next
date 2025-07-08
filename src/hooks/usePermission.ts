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
  
  // If permissions failed to load, allow access as fallback (for mobile)
  if (!permissions) {
    console.warn(`Permissions not loaded for module: ${module}, allowing access as fallback`);
    return true;
  }
  
  // Check if module exists in permissions
  if (!permissions[module]) {
    console.warn(`Module ${module} not found in permissions, allowing access as fallback`);
    return true;
  }
  
  // Check if permissions array is valid
  if (!Array.isArray(permissions[module])) {
    console.warn(`Invalid permissions structure for module: ${module}, allowing access as fallback`);
    return true;
  }
  
  return actions.some((action) => permissions[module].includes(action));
}
