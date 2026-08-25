// Service for member operations

import apiCommunity from '@/utils/communityApi';
import { Member } from '@/interfaces/members';
import { SortingState } from '@tanstack/react-table';

// Interfaces for fee status and payments
export interface MemberFeeStatus {
  memberFeeId: string;
  feeName: string;
  amountDue: number;
  amountPaid: number;
  status: string;
  year: number;
  lastPaymentDate: string | null;
}

export interface MemberFeesStatusResponse {
  memberId: string;
  memberName: string;
  fees: MemberFeeStatus[];
}

export interface MemberFeePayment {
  invoiceFeePaymentId: string;
  invoiceId: string;
  amountPaid: number;
  paymentDate: string;
  collectedBy: string;
  cashRegisterName: string;
}

export interface MemberFeePaymentsResponse {
  memberFeeId: string;
  feeName: string;
  amountDue: number;
  totalAmountPaid: number;
  remainingBalance: number;
  status: string;
  payments: MemberFeePayment[];
}

// Main service functions
export const getMembers = async (
  limit: number,
  offset: number,
  search: string = '',
  sorting: SortingState = [],
  neighborhoodId?: string
): Promise<{ data: Member[]; count: number }> => {
  const params: any = { limit, offset, search };
  if (neighborhoodId && neighborhoodId !== 'ALL') {
    params.neighborhoodId = neighborhoodId;
  }
  if (sorting && sorting.length > 0) {
    params.orderBy = sorting[0].id;
    params.order = sorting[0].desc ? 'desc' : 'asc';
  }
  const { data } = await apiCommunity.get<{ data: Member[]; count: number }>(
    '/members',
    {
      params
    }
  );
  return data;
};

export type CreateMemberPayload = {
  personId: string;
  houseNumber?: string;
};

export const createMember = async (data: CreateMemberPayload) => {
  const payload: CreateMemberPayload = {
    personId: String(data.personId)
  };
  if (data.houseNumber) {
    payload.houseNumber = data.houseNumber;
  }
  const response = await apiCommunity.post('/members', payload);
  return response.data;
};

export const updateMember = async (id: string, data: Partial<Member>) => {
  const response = await apiCommunity.patch(`/members/${id}`, data);
  return response.data;
};

export const getMemberById = async (id: string): Promise<Member> => {
  const { data } = await apiCommunity.get<Member>(`/members/${id}`);
  return data;
};

/**
 * Gets the current status of all fees for a member
 */
export const getMemberFeesStatus = async (
  memberId: string
): Promise<MemberFeesStatusResponse> => {
  const { data } = await apiCommunity.get<MemberFeesStatusResponse>(
    `/members/${memberId}/fees/status`
  );
  return data;
};

/**
 * Gets the complete payment history for a specific fee of a member
 */
export const getMemberFeePayments = async (
  memberId: string,
  memberFeeId: string
): Promise<MemberFeePaymentsResponse> => {
  const { data } = await apiCommunity.get<MemberFeePaymentsResponse>(
    `/members/${memberId}/fees/${memberFeeId}/payments`
  );
  return data;
};
