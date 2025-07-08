import create from 'zustand';
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
    
    console.log('Starting permissions fetch...');
    set({ isLoading: true, error: null });
    
    // Add timeout to prevent infinite loading (shorter for mobile)
    const timeoutId = setTimeout(() => {
      console.warn('Permissions fetch timeout, allowing access as fallback');
      set({ permissions: null, isLoading: false, error: 'timeout' });
    }, 5000); // 5 seconds timeout for mobile
    
    try {
      console.log('Making API call to /users/me...');
      const { data } = await apiCommunity.get<{
        permissions: Record<string, string[]>;
      }>('/users/me');
      
      clearTimeout(timeoutId);
      console.log('API response received:', data);
      
      // Validate that permissions exist and have the expected structure
      if (data && data.permissions && typeof data.permissions === 'object') {
        console.log('Permissions loaded successfully:', data.permissions);
        set({ permissions: data.permissions, isLoading: false, error: null });
      } else {
        console.warn('Invalid permissions structure received:', data);
        set({ permissions: null, isLoading: false, error: 'invalid_structure' });
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Error fetching permissions:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      set({ 
        permissions: null, 
        isLoading: false, 
        error: error.response?.status === 401 ? 'unauthorized' : 'network_error' 
      });
    }
  },
  clearPermissions: () => set({ permissions: null, isLoading: false, error: null })
}));
