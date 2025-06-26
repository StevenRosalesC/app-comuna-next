export interface CashRegister {
  cashRegisterId: string;
  openDate: string;
  closeDate: string | null;
  initialAmount: number;
  finalAmount: number | null;
  notes: string | null;
  closed: boolean;
  openedByUser: {
    person: {
      firstName: string;
      lastName: string;
    };
  };
  closedByUser: {
    person: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export interface CreateCashRegisterDto {
  initialAmount: number;
  notes?: string;
}

export interface CloseCashRegisterDto {
  notes?: string;
}

export interface PaginatedCashRegistersResponse {
  total: number;
  cashRegisters: CashRegister[];
}

export interface UpdateCashRegisterDto {
  closingNotes?: string;
} 