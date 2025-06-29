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

export interface GetAnnualFeesParams {
  limit: number;
  offset: number;
  year?: number;
  search?: string;
}
