import { AnnualFee } from './annual-fee';

export type MemberFeeStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELED';

export interface MemberFee {
  memberFeeId: string;
  status: MemberFeeStatus;
  annualFee: AnnualFee;
  amountDue: number;
  amountPaid: number;
}
