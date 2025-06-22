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

export const invoicingService = {
  createInvoice: async (dto: CreateInvoiceDto): Promise<Invoice> => {
    const invoice = {
      memberId: Number(dto.memberId),
      cashRegisterId: Number(dto.cashRegisterId),
      discount: Number(dto.discount),
      fees: dto.fees.map((fee) => ({
        memberFeeId: fee.memberFeeId,
        amountToPay: fee.amountToPay
      }))
    }
    const { data } = await apiCommunity.post<Invoice>('/invoicing', invoice);
    return data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const { data } = await apiCommunity.get<Invoice>(`/invoicing/${id}`);
    return data;
  },

  getInvoicesByMemberId: async ({
    memberId,
    limit,
    offset,
    startDate,
    endDate
  }: GetInvoicesByMemberIdParams): Promise<PaginatedInvoicesResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await apiCommunity.get<PaginatedInvoicesResponse>(
      `/invoicing/member/${memberId}`,
      { params }
    );
    return data;
  }
}; 