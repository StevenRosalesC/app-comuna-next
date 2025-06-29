import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to invalidate all queries related to a member
 * This ensures data is automatically updated after any action
 */
export function useMemberQueries(memberId: string) {
  const queryClient = useQueryClient();

  const invalidateAllMemberQueries = () => {
    // Invalidate all queries related to the member
    queryClient.invalidateQueries({ queryKey: ['members', memberId] });
    queryClient.invalidateQueries({ queryKey: ['memberFeesStatus', memberId] });
    queryClient.invalidateQueries({ queryKey: ['memberInvoices'] });
    queryClient.invalidateQueries({ queryKey: ['detailedReceipts'] });
    queryClient.invalidateQueries({ queryKey: ['memberFeePayments'] });
  };

  const invalidateMemberFeesQueries = () => {
    // Invalidate only fee-related queries
    queryClient.invalidateQueries({ queryKey: ['memberFeesStatus', memberId] });
    queryClient.invalidateQueries({ queryKey: ['memberFeePayments'] });
  };

  const invalidateMemberInvoicesQueries = () => {
    // Invalidate only invoice-related queries
    queryClient.invalidateQueries({ queryKey: ['memberInvoices'] });
    queryClient.invalidateQueries({ queryKey: ['detailedReceipts'] });
  };

  return {
    invalidateAllMemberQueries,
    invalidateMemberFeesQueries,
    invalidateMemberInvoicesQueries
  };
}
