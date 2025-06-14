// Service for member operations (skeleton)

import apiCommunity from '@/utils/communityApi';
import { Member } from '@/interfaces/members';

export const getMembers = async (limit: number, offset: number, search: string = ''): Promise<{ data: Member[]; count: number }> => {
  const { data } = await apiCommunity.get<{ data: Member[]; count: number }>('/members', {
    params: { limit, offset, search }
  });
  return data;
};

export const createMember = async (data: Partial<Member>) => {
  const response = await apiCommunity.post('/members', data);
  return response.data;
};

export const updateMember = async (id: string, data: Partial<Member>) => {
  const response = await apiCommunity.patch(`/members/${id}`, data);
  return response.data;
}; 