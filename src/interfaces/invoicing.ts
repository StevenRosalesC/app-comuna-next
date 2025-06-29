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
  memberId: string;
  invoiceNumber: null;
  invoiceDate: Date;
  invoiceTime: null;
  subtotal: number;
  discount: number;
  totalAmount: number;
  invoiceStatus: number;
  collectedByUserId: string;
  cashRegisterId: string;
  member: Member;
  cancelledAt?: string;
  cancelledBy?: CollectedByUser;
  cancellationReason?: string;
}

export interface Member {
  memberId: string;
  personId: string;
  houseNumber: null | string;
  createdAt: Date;
  status: boolean;
  person: Person;
}

export interface Person {
  personId: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  phoneNumber: null;
  birthDate: Date;
  status: boolean;
  email: null | string;
  neighborhoodId: string;
  hasDisability: boolean;
  disabilityPercentage?: number;
}

// Full details for dialog view
export interface InvoiceFeePayment {
  invoiceFeePaymentId: string;
  memberFeeId: string;
  amountPaid: number;
  paymentDate: string;
  memberFee: {
    memberFeeId: string;
    amountPaid: number;
    amountDue: number;
    status: string;
    annualFee: {
      name: string;
      description: string;
      year: number;
    };
  };
}

export interface Invoice {
  invoiceId: string;
  invoiceDate: string;
  subtotal: number;
  discount: number | null;
  totalAmount: number;
  invoiceStatus: number;
  memberId: string;
  invoiceFeePayments: InvoiceFeePayment[];
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
  receiptUrl?: string;
  cancelledAt?: string;
  cancelledBy?: CollectedByUser;
  cancellationReason?: string;
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
  invoices: InvoiceSummary[] | Invoice[];
}
