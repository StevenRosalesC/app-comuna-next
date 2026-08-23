import { Requirement } from '@/interfaces/requirements';
import apiCommunity from '@/utils/communityApi';

export const requirementsService = {
  async list(
    limit: number,
    offset: number
  ): Promise<{ data: Requirement[]; count: number }> {
    const response = await apiCommunity.get<any>('/requirements', {
      params: { limit, offset }
    });

    const resData = response.data;
    if (resData && typeof resData === 'object' && !Array.isArray(resData)) {
      const items: Requirement[] = Array.isArray(resData.data)
        ? resData.data
        : Array.isArray(resData.requirements)
        ? resData.requirements
        : [];
      const count =
        typeof resData.count === 'number'
          ? resData.count
          : typeof resData.total === 'number'
          ? resData.total
          : Number(response.headers?.['x-total-count']) || items.length;
      return { data: items, count };
    }

    if (Array.isArray(resData)) {
      const count =
        Number(response.headers?.['x-total-count']) ||
        Number(response.headers?.['content-range']?.split('/')?.[1]) ||
        resData.length;
      return { data: resData, count };
    }

    return { data: [], count: 0 };
  },
  async listAll(): Promise<Requirement[]> {
    const { data } = await apiCommunity.get<any>(
      '/requirements?limit=1000'
    );
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.requirements)) return data.requirements;
    return [];
  },
  async create(data: Omit<Requirement, 'requirementId'>): Promise<Requirement> {
    try {
      const { data: newReq } = await apiCommunity.post('/requirements', data);
      return newReq;
    } catch (error) {
      throw new Error('Error al añadir el requisito');
    }
  },
  async update(
    id: string,
    data: Omit<Requirement, 'requirementId'>
  ): Promise<Requirement | null> {
    try {
      const { data: updatedReq } = await apiCommunity.patch(
        `/requirements/${id}`,
        data
      );
      return updatedReq;
    } catch (error) {
      throw new Error('Error al actualizar el requisito');
    }
  },
  async remove(id: string): Promise<boolean> {
    try {
      const { data: removedReq } = await apiCommunity.delete(
        `/requirements/${id}`
      );
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
  }
};
