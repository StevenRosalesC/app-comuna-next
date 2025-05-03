export interface AnnualFee {
  id: string;
  personId: string;
  year: number;
  amount: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
} 