import { create } from 'zustand';
import apiCommunity from '@/utils/communityApi';

interface PermissionsState {
  permissions: Record<string, string[]> | null;
  isLoading: boolean;
  error: string | null;
  fetchPermissions: () => Promise<void>;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: null,
  isLoading: false,
  error: null,
  fetchPermissions: async () => {
    const { isLoading, permissions } = get();
    if (isLoading || permissions) return; // Prevent infinite loop
    
    set({ isLoading: true, error: null });
    
    // Add timeout to prevent infinite loading (shorter for mobile)
    const timeoutId = setTimeout(() => {
      set({ permissions: null, isLoading: false, error: 'timeout' });
    }, 5000); // 5 seconds timeout for mobile
    
    try {
      const { data } = await apiCommunity.get<{
        permissions: Record<string, string[]>;
      }>('/users/me');
      
      clearTimeout(timeoutId);
      
      // Validate that permissions exist and have the expected structure
      if (data && data.permissions && typeof data.permissions === 'object') {
        set({ permissions: data.permissions, isLoading: false, error: null });
      } else {
        set({ permissions: null, isLoading: false, error: 'invalid_structure' });
      }
    } catch (error: any) {
      set({ 
        permissions: null, 
        isLoading: false, 
        error: error.response?.status === 401 ? 'unauthorized' : 'network_error' 
      });
    }
  },
  clearPermissions: () => set({ permissions: null, isLoading: false, error: null })
}));
