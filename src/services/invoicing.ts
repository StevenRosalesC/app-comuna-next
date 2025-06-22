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
}

interface GetInvoicesByCashRegisterIdParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

class InvoicingService {
  private readonly api = apiCommunity;

  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const { data } = await this.api.post<Invoice>('/invoicing', dto);
    return data;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const { data } = await this.api.get<Invoice>(`/invoicing/${id}`);
    return data;
  }

  async getInvoicesByMemberId({
    memberId,
    limit,
    offset,
    startDate,
    endDate
  }: GetInvoicesByMemberIdParams): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await this.api.get<PaginatedInvoicesResponse>(
      `/invoicing/member/${memberId}`,
      { params }
    );
    return data;
  }

  async getInvoicesByCashRegisterId({
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

    const { data } = await this.api.get<PaginatedInvoicesResponse>(
      `/invoicing/cash-register/active`,
      { params }
    );
    return data;
  }
}

export const invoicingService = new InvoicingService(); 