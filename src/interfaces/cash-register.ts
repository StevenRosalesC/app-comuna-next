export interface CashRegister {
  cashRegisterId: string;
  cashRegisterName?: string | null;
  openDate: string;
  closeDate: string | null;
  initialAmount: number;
  finalAmount: number | null;
  updatedAt: string;
  notes: string | null;
  closed: boolean;
  openedByUserId: string;
  closedByUserId?: string | null;
  openedByUser: {
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
  } | null;
  invoices?: Invoice[];
}

export interface Invoice {
  invoiceId: string;
  invoiceNumber: number;
  invoiceDate: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  member: {
    memberId: string;
    person: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateCashRegisterDto {
  cashRegisterName?: string;
  initialAmount: number;
  notes?: string;
}

export interface CloseCashRegisterDto {
  closingNotes: string;
}

export interface PaginatedCashRegistersResponse {
  total: number;
  cashRegisters: CashRegister[];
}

export interface UpdateCashRegisterDto {
  closingNotes?: string;
}

// Income interfaces
export interface Income {
  incomeId: string;
  description?: string;
  amount: number;
  incomeDate: string;
  incomeStatus: number; // 1 = Active, 0 = Cancelled
  expense_code?: number;
}

export interface CreateIncomeDto {
  description?: string;
  amount: number;
  incomeDate?: string;
  expense_code?: number;
  cashRegisterId: number;
}

export interface UpdateIncomeDto {
  description?: string;
  amount?: number;
  incomeDate?: string;
  expense_code?: number;
}

export interface GetIncomesParams {
  limit?: number;
  offset?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  cashRegisterId?: number;
}

export interface PaginatedIncomesResponse {
  total: number;
  incomes: Income[];
}

// Expense interfaces
export interface Expense {
  expenseId: string;
  description?: string;
  amount: number;
  expenseDate: string;
  cashRegisterId: string;
  status: boolean; // true = Active, false = Cancelled
  cashRegister?: {
    cashRegisterName?: string;
  };
}

export interface CreateExpenseDto {
  description?: string;
  amount: number;
  expenseDate?: string;
  cashRegisterId: number;
}

export interface UpdateExpenseDto {
  description?: string;
  amount?: number;
  expenseDate?: string;
}

export interface GetExpensesParams {
  limit?: number;
  offset?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  cashRegisterId?: number;
}

export interface PaginatedExpensesResponse {
  total: number;
  expenses: Expense[];
}
