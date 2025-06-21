export interface AnnualFee {
  feeId: string;
  name: string;
  description: string;
  amount: number;
  status: boolean;
  year: number;
}

export type CreateAnnualFee = Omit<AnnualFee, 'feeId'>;

export type UpdateAnnualFee = Partial<CreateAnnualFee>; 