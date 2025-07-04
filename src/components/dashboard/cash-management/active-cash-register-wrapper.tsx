'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister } from '@/interfaces/cash-register';
import ActiveCashRegister from './active-cash-register';
import OpenCashRegister from './open-cash-register';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ActiveCashRegisterWrapperProps {
  onRefresh?: () => void;
}

export function ActiveCashRegisterWrapper({ onRefresh }: ActiveCashRegisterWrapperProps) {
  const { data: activeRegisterData, isLoading: queryLoading } = useQuery<CashRegister | null, Error>({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
  });

  const handleRefresh = () => {
    onRefresh?.();
  };

  if (queryLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!activeRegisterData) {
    return <OpenCashRegister canOpenCashRegister={true} onSuccess={handleRefresh} />;
  }

  return (
    <ActiveCashRegister
      activeCashRegister={activeRegisterData}
      canCloseCashRegister={true}
      canCreateIncome={true}
      canCreateExpense={true}
      canReadIncome={true}
      canReadExpense={true}
      canDeletePayment={true}
      canDeleteIncome={true}
      canDeleteExpense={true}
      canCancelInvoice={true}
    />
  );
} 