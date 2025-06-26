import apiCommunity from '@/utils/communityApi';
import {
  type CreateInvoiceDto,
  type Invoice,
  type PaginatedInvoicesResponse
} from '@/interfaces/invoicing';

interface GetInvoicesByMemberIdParams {
  memberId: string;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  includeDetails?: boolean;
}

interface GetInvoicesByCashRegisterIdParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

class InvoicingService {

  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = {
      memberId: Number(dto.memberId),
      cashRegisterId: Number(dto.cashRegisterId),
      discount: dto.discount ?? 0,
      fees: dto.fees.map((fee) => ({
        memberFeeId: fee.memberFeeId,
        amountToPay: fee.amountToPay
      }))
    }
    const { data } = await apiCommunity.post<Invoice>('/invoicing', invoice);
    return data;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const { data } = await apiCommunity.get<Invoice>(`/invoicing/${id}`);
    return data;
  }

  async getInvoicesByMemberId({
    memberId,
    limit,
    offset,
    startDate,
    endDate,
    includeDetails = false
  }: GetInvoicesByMemberIdParams): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (includeDetails) params.append('includeDetails', 'true');

    const { data } = await apiCommunity.get<PaginatedInvoicesResponse>(
      `/invoicing/member/${memberId}`,
      { params }
    );
    return data;
  }
  async getInvoicesActiveCashRegister({
    limit,
    offset,
    startDate,
    endDate
  }: GetInvoicesByCashRegisterIdParams): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const { data } = await apiCommunity.get<PaginatedInvoicesResponse>(
      `/invoicing/cash-register/active`,
      { params }
    );
    return data;
  }
  // cing/cash-register/1?limit=20&offset=0

  async getInvoicesByCashRegisterId({
    cashRegisterId,
    limit,
    offset,
    startDate,
    endDate
  }: GetInvoicesByCashRegisterIdParams & { cashRegisterId: string }): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await apiCommunity.get<PaginatedInvoicesResponse>(
      `/invoicing/cash-register/${cashRegisterId}`,
      { params }
    );
    return data;  
  }

}

export const invoicingService = new InvoicingService(); 