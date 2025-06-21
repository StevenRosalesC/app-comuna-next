import apiCommunity from '@/utils/communityApi';
import { Invoice, CreateInvoiceDto } from '@/interfaces/invoicing';

export const invoicingService = {
  createInvoice: async (dto: CreateInvoiceDto): Promise<Invoice> => {
    const { data } = await apiCommunity.post<Invoice>('/invoicing', dto);
    return data;
  }
}; 