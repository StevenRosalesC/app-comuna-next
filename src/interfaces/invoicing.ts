export interface CreateInvoiceDto {
  memberId: string;
  memberFeeIds: string[];
  cashRegisterId: string;
  discount?: number;
}

export interface Invoice {
  invoiceId: number;
  memberId: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  invoiceStatus: number;
} 