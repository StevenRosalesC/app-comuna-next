import { AnnualFee } from './annual-fee';

export type MemberFeeStatus = 'PENDING' | 'PAID' | 'CANCELED';

export interface MemberFee {
  memberFeeId: string;
  status: MemberFeeStatus;
  annualFee: AnnualFee;
} 