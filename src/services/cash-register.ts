import {
  CashRegister,
  CreateCashRegisterDto,
  CloseCashRegisterDto,
  PaginatedCashRegistersResponse
} from '@/interfaces/cash-register';
import apiCommunity from '@/utils/communityApi';
import axios from 'axios';

interface GetCashRegistersParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

class CashRegisterService {

  async getActiveRegister(): Promise<CashRegister | null> {
    try {
      const { data } = await apiCommunity.get<CashRegister>(
        '/cash-registers/active'
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async openRegister(
    dto: CreateCashRegisterDto
  ): Promise<CashRegister> {
    const { data } = await apiCommunity.post<CashRegister>(
      '/cash-registers',
      dto
    );
    return data;
  }

  async closeRegister(
    id: string,
    dto: CloseCashRegisterDto
  ): Promise<CashRegister> {
    const { data } = await apiCommunity.patch<CashRegister>(
      `/cash-registers/${id}/close`,
      dto
    );
    return data;
  }

  async getCashRegisters({
    limit,
    offset,
    startDate,
    endDate
  }: GetCashRegistersParams): Promise<PaginatedCashRegistersResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await apiCommunity.get<PaginatedCashRegistersResponse>(
      '/cash-registers',
      { params }
    );
    return data;
  }

  async getCashRegisterById(id: string): Promise<CashRegister> {
    const { data } = await apiCommunity.get<CashRegister>(
      `/cash-registers/${id}`
    );
    return data;
  }
}

export const cashRegisterService = new CashRegisterService(); 