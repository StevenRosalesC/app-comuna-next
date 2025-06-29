import apiCommunity from '@/utils/communityApi';

export interface ReceiptHistoryItem {
  invoiceId: string;
  invoiceDate: string;
  totalAmount: number;
  memberName: string;
  fees: {
    feeName: string;
    amountPaid: number;
    year: number;
  }[];
}

export interface DetailedReceiptHistoryItem {
  invoiceId: string;
  invoiceDate: string;
  invoiceTime: string | null;
  subtotal: number;
  discount: number;
  totalAmount: number;
  invoiceStatus: number;
  memberName: string;
  memberEmail: string;
  houseNumber: string;
  collectedBy: string;
  cashRegisterName: string;
  fees: {
    feeName: string;
    feeDescription: string;
    amountDue: number;
    amountPaid: number;
    year: number;
    status: string;
  }[];
  receiptUrl: string;
}

interface GetReceiptHistoryParams {
  memberId: string;
  limit?: number;
  offset?: number;
}

class ReceiptsService {
  /**
   * Resends the receipt PDF via email to a member
   */
  async resendReceipt(
    invoiceId: string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiCommunity.post<{
      success: boolean;
      message: string;
    }>(`/receipts/resend/${invoiceId}`);
    return data;
  }

  /**
   * Gets a simple history of all receipts for a member
   */
  async getReceiptHistory({
    memberId,
    limit = 10,
    offset = 0
  }: GetReceiptHistoryParams): Promise<ReceiptHistoryItem[]> {
    const params = new URLSearchParams();
    params.append('limit', String(limit));
    params.append('offset', String(offset));

    const { data } = await apiCommunity.get<ReceiptHistoryItem[]>(
      `/receipts/history/${memberId}`,
      { params }
    );
    return data;
  }

  /**
   * Gets a detailed history of receipts for a member
   */
  async getDetailedReceiptHistory({
    memberId,
    limit = 10,
    offset = 0
  }: GetReceiptHistoryParams): Promise<DetailedReceiptHistoryItem[]> {
    const params = new URLSearchParams();
    params.append('limit', String(limit));
    params.append('offset', String(offset));

    const { data } = await apiCommunity.get<DetailedReceiptHistoryItem[]>(
      `/receipts/member/${memberId}/detailed`,
      { params }
    );
    return data;
  }

  /**
   * Downloads the PDF of a receipt
   */
  async downloadReceiptPdf(invoiceId: string): Promise<Blob> {
    const { data } = await apiCommunity.get<Blob>(
      `/invoicing/${invoiceId}/receipt`,
      {
        responseType: 'blob'
      }
    );
    return data;
  }
}

export const receiptsService = new ReceiptsService();
