export interface CashRegister {
  cashRegisterId: string;
  cashRegisterName: string | null;
  openDate: string;
  closeDate: string | null;
  initialAmount: number;
  finalAmount: number;
  updatedAt: string;
  closed: boolean;
  notes: string | null;
  openedByUserId: string;
  closedByUserId: string | null;
  openedByUser?: {
    person: {
      firstName: string;
      lastName: string;
    };
  };
  closedByUser?: {
    person: {
      firstName: string;
      lastName: string;
    };
  };
  invoices?: any[];
}

export interface CreateCashRegisterDto {
  initialAmount: number;
  notes?: string;
}

export interface UpdateCashRegisterDto {
  closingNotes?: string;
} 