// Service for annual fee operations (skeleton)

import apiCommunity from '@/utils/communityApi';
import {
  AnnualFee,
  CreateAnnualFee,
  GetAnnualFeesParams,
  UpdateAnnualFee
} from '@/interfaces/annual-fee';

export const getAnnualFees = async ({
  limit,
  offset,
  search,
  year
}: GetAnnualFeesParams): Promise<{ data: AnnualFee[]; count: number }> => {
  try {
    const { data: response } = await apiCommunity.get<{
      data: AnnualFee[];
      count: number;
    }>('/annual-fees', {
      params: { limit, offset, search, year }
    });
    return response;
  } catch (error) {
    throw error;
  };
};

export const createAnnualFee = async (fee: CreateAnnualFee): Promise<AnnualFee> => {
  try {
    const { data } = await apiCommunity.post<AnnualFee>('/annual-fees', fee);
    return data;
  } catch (error) {
    throw error;
  };
};

export const updateAnnualFee = async (feeId: string, fee: UpdateAnnualFee): Promise<AnnualFee> => {
  try {
    const { data } = await apiCommunity.put<AnnualFee>(`/annual-fees/${feeId}`, fee);
    return data
  } catch (error) {
    throw error;
  };
};

export const deleteAnnualFee = async (feeId: string): Promise<void> => {
  try {
    await apiCommunity.delete(`/annual-fees/${feeId}`);
  } catch (error) {
    throw error;
  };
}; 