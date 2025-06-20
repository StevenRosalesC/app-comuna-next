// Service for member operations (skeleton)

import apiCommunity from '@/utils/communityApi';
import { Member } from '@/interfaces/members';
import { SortingState } from '@tanstack/react-table';

export const getMembers = async (
  limit: number,
  offset: number,
  search: string = '',
  sorting: SortingState
): Promise<{ data: Member[]; count: number }> => {
  const params: any = { limit, offset, search };
  if (sorting.length > 0) {
    params.orderBy = sorting[0].id;
    params.order = sorting[0].desc ? 'desc' : 'asc';
  }
  const { data } = await apiCommunity.get<{ data: Member[]; count: number }>(
    '/members',
    {
      params
    }
  );
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

export const getMemberById = async (id: string): Promise<Member> => {
  const { data } = await apiCommunity.get<Member>(`/members/${id}`);
  return data;
}; 