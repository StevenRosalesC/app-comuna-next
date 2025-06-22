export interface InvoiceMemberFee {
  memberFeeId: string;
  amountPaid: number;
  annualFee: {
    name: string;
    year: number;
  };
}

// Summary for list view on member's page
export interface InvoiceSummary {
  invoiceId: string;
  totalAmount: number;
  invoiceDate: string;
}

// Full details for dialog view
export interface Invoice {
  invoiceId: string;
  invoiceDate: string;
  subtotal: number;
  discount: number | null;
  totalAmount: number;
  invoiceStatus: number;
  memberId: string;
  memberFees: InvoiceMemberFee[];
  cashRegister: {
    cashRegisterId: string;
  };
  member: {
    person: {
      firstName: string;
      lastName: string;
    };
  };
  collectedByUser: CollectedByUser | null;
}

export interface CreateInvoiceDto {
  memberId: string;
  cashRegisterId: string;
  discount?: number;
  fees: {
    memberFeeId: string;
    amountToPay: number;
  }[];
} 

export interface CollectedByUser {
  person: {
    firstName: string;
    lastName: string;
  };
  personId: string;
}

export interface PaginatedInvoicesResponse {
  total: number;
  invoices: InvoiceSummary[];
}
