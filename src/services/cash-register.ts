import apiCommunity from '@/utils/communityApi';
import {
  CashRegister,
  CreateCashRegisterDto,
  UpdateCashRegisterDto
} from '@/interfaces/cash-register';

export const cashRegisterService = {
  getActiveRegister: async (): Promise<CashRegister | null> => {
    const { data } = await apiCommunity.get<CashRegister | null>(
      '/cash-registers/active'
    );
    return data;
  },

  openRegister: async (dto: CreateCashRegisterDto): Promise<CashRegister> => {
    const { data } = await apiCommunity.post<CashRegister>(
      '/cash-registers',
      dto
    );
    return data;
  },

  closeRegister: async (
    id: string,
    dto: UpdateCashRegisterDto
  ): Promise<CashRegister> => {
    const { data } = await apiCommunity.patch<CashRegister>(
      `/cash-registers/${id}/close`,
      dto
    );
    return data;
  },

  getRegisterDetails: async (id: string): Promise<CashRegister> => {
    const { data } = await apiCommunity.get<CashRegister>(
      `/cash-registers/${id}`
    );
    return data;
  }
}; 