import {
  CashRegister,
  CreateCashRegisterDto,
  CloseCashRegisterDto,
  PaginatedCashRegistersResponse,
  Income,
  CreateIncomeDto,
  UpdateIncomeDto,
  GetIncomesParams,
  PaginatedIncomesResponse,
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  GetExpensesParams,
  PaginatedExpensesResponse
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
  // Cash Register Management
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

  async openRegister(dto: CreateCashRegisterDto): Promise<CashRegister> {
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

  // Income Management
  async createIncome(dto: CreateIncomeDto): Promise<Income> {
    const { data } = await apiCommunity.post<Income>(
      '/cash-registers/incomes',
      dto
    );
    return data;
  }

  async getIncomes(params: GetIncomesParams): Promise<PaginatedIncomesResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.minAmount) queryParams.append('minAmount', String(params.minAmount));
    if (params.maxAmount) queryParams.append('maxAmount', String(params.maxAmount));
    if (params.cashRegisterId) queryParams.append('cashRegisterId', String(params.cashRegisterId));

    const { data } = await apiCommunity.get<PaginatedIncomesResponse>(
      '/cash-registers/incomes',
      { params: queryParams }
    );
    return data;
  }

  async getIncomeById(id: string): Promise<Income> {
    const { data } = await apiCommunity.get<Income>(
      `/cash-registers/incomes/${id}`
    );
    return data;
  }

  async updateIncome(id: string, dto: UpdateIncomeDto): Promise<Income> {
    const { data } = await apiCommunity.patch<Income>(
      `/cash-registers/incomes/${id}`,
      dto
    );
    return data;
  }

  async cancelIncome(id: string): Promise<Income> {
    const { data } = await apiCommunity.delete<Income>(
      `/cash-registers/incomes/${id}/cancel`
    );
    return data;
  }

  // Expense Management
  async createExpense(dto: CreateExpenseDto): Promise<Expense> {
    const { data } = await apiCommunity.post<Expense>(
      '/cash-registers/expenses',
      dto
    );
    return data;
  }

  async getExpenses(params: GetExpensesParams): Promise<PaginatedExpensesResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.minAmount) queryParams.append('minAmount', String(params.minAmount));
    if (params.maxAmount) queryParams.append('maxAmount', String(params.maxAmount));
    if (params.cashRegisterId) queryParams.append('cashRegisterId', String(params.cashRegisterId));

    const { data } = await apiCommunity.get<PaginatedExpensesResponse>(
      '/cash-registers/expenses',
      { params: queryParams }
    );
    return data;
  }

  async getExpenseById(id: string): Promise<Expense> {
    const { data } = await apiCommunity.get<Expense>(
      `/cash-registers/expenses/${id}`
    );
    return data;
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const { data } = await apiCommunity.patch<Expense>(
      `/cash-registers/expenses/${id}`,
      dto
    );
    return data;
  }

  async cancelExpense(id: string): Promise<Expense> {
    const { data } = await apiCommunity.delete<Expense>(
      `/cash-registers/expenses/${id}/cancel`
    );
    return data;
  }

  // Report Generation
  async generateReport(startDate: string, endDate: string): Promise<Blob> {
    const { data } = await apiCommunity.get<Blob>(
      `/reports/cash-register?startDate=${startDate}&endDate=${endDate}`,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      }
    );
    return data;
  }
}

export const cashRegisterService = new CashRegisterService();
