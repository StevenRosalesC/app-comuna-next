// Service for annual fee operations (skeleton)

import apiCommunity from '@/utils/communityApi';
import { AnnualFee, CreateAnnualFee, UpdateAnnualFee } from '@/interfaces/annual-fee';

export const getAnnualFees = async (
  limit: number,
  offset: number
): Promise<{ data: AnnualFee[]; count: number }> => {
  const response = await apiCommunity.get<AnnualFee[]>('/annual-fees', {
    params: { limit, offset }
  });
  const count = Number(response.headers['x-total-count']) || 0;
  return { data: response.data, count };
};

export const createAnnualFee = async (fee: CreateAnnualFee): Promise<AnnualFee> => {
  const { data } = await apiCommunity.post<AnnualFee>('/annual-fees', fee);
  return data;
};

export const updateAnnualFee = async (feeId: string, fee: UpdateAnnualFee): Promise<AnnualFee> => {
  const { data } = await apiCommunity.put<AnnualFee>(`/annual-fees/${feeId}`, fee);
  return data;
};

export const deleteAnnualFee = async (feeId: string): Promise<void> => {
  await apiCommunity.delete(`/annual-fees/${feeId}`);
}; 