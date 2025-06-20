export interface AnnualFee {
  feeId: string;
  description: string;
  amount: number;
  status: boolean;
}

export type CreateAnnualFee = Omit<AnnualFee, 'feeId'>;

export type UpdateAnnualFee = Partial<CreateAnnualFee>; 