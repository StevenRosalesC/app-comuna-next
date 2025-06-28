import apiCommunity from '@/utils/communityApi';

export const rolesService = {
  async getRoles() {
    const { data } = await apiCommunity.get('/user-roles');
    return data;
  },
  async updateRolePermissions(
    roleId: string,
    permissions: Record<string, string[]>
  ) {
    try {
      const { data } = await apiCommunity.patch(`/user-roles/${roleId}`, {
        permissions
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
  async createRole(role: {
    name: string;
    permissions: Record<string, string[]>;
  }) {
    const { data } = await apiCommunity.post('/user-roles', role);
    return data;
  },
  async deleteRole(roleId: string) {
    const { data } = await apiCommunity.delete(`/user-roles/${roleId}`);
    return data;
  }
};
