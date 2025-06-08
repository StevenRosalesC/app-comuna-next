import create from 'zustand';
import apiCommunity from '@/utils/communityApi';

interface PermissionsState {
  permissions: Record<string, string[]> | null;
  isLoading: boolean;
  fetchPermissions: () => Promise<void>;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
  permissions: null,
  isLoading: false,
  fetchPermissions: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiCommunity.get<{ permissions: Record<string, string[]> }>('/users/me');
      set({ permissions: data.permissions, isLoading: false });
    } catch (error) {
      set({ permissions: null, isLoading: false });
    }
  },
  clearPermissions: () => set({ permissions: null, isLoading: false }),
})); 