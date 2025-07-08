import create from 'zustand';
import apiCommunity from '@/utils/communityApi';

interface PermissionsState {
  permissions: Record<string, string[]> | null;
  isLoading: boolean;
  fetchPermissions: () => Promise<void>;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: null,
  isLoading: false,
  fetchPermissions: async () => {
    const { isLoading, permissions } = get();
    if (isLoading || permissions) return; // Prevent infinite loop
    set({ isLoading: true });
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('Permissions fetch timeout, allowing access as fallback');
      set({ permissions: null, isLoading: false });
    }, 10000); // 10 seconds timeout
    
    try {
      const { data } = await apiCommunity.get<{
        permissions: Record<string, string[]>;
      }>('/users/me');
      
      clearTimeout(timeoutId);
      
      // Validate that permissions exist and have the expected structure
      if (data && data.permissions && typeof data.permissions === 'object') {
        set({ permissions: data.permissions, isLoading: false });
      } else {
        console.warn('Invalid permissions structure received:', data);
        set({ permissions: null, isLoading: false });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error fetching permissions:', error);
      set({ permissions: null, isLoading: false });
    }
  },
  clearPermissions: () => set({ permissions: null, isLoading: false })
}));
