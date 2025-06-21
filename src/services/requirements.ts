import { Requirement } from '@/interfaces/requirements';
import apiCommunity from '@/utils/communityApi';

export const requirementsService = {
  async list(
    limit: number,
    offset: number
  ): Promise<{ data: Requirement[]; count: number }> {
    const response = await apiCommunity.get<Requirement[]>('/requirements', {
      params: { limit, offset }
    });
    const count = Number(response.headers['x-total-count']) || 0;
    return { data: response.data, count };
  },
  async listAll(): Promise<Requirement[]> {
    const { data } = await apiCommunity.get<Requirement[]>('/requirements?limit=1000');
    return data;
  },
  async create(data: Omit<Requirement, 'requirementId'>): Promise<Requirement> {
    try {
      const { data: newReq } = await apiCommunity.post('/requirements', data);
      return newReq;
    } catch (error) {
      throw new Error('Error al añadir el requisito');
    }
  },
  async update(id: string, data: Omit<Requirement, 'requirementId'>): Promise<Requirement | null> {
    try {
      const { data: updatedReq } = await apiCommunity.patch(`/requirements/${id}`, data);
      return updatedReq;
    } catch (error) {
      throw new Error('Error al actualizar el requisito');
    }
  },
  async remove(id: string): Promise<boolean> {
    try {
      const { data: removedReq } = await apiCommunity.delete(`/requirements/${id}`);
      return removedReq;
    } catch (error) {
      throw new Error('Error al eliminar el requisito');
    }
  },
  async approve(
    personId: string,
    requirementId: string,
    data: { observation?: string }
  ): Promise<any> {
    try {
      const { data: approval } = await apiCommunity.patch(
        `/persons/${personId}/requirements/${requirementId}/approve`,
        data
      );
      return approval;
    } catch (error) {
      throw new Error('Error al aprobar el requisito');
    }
  },
}; 