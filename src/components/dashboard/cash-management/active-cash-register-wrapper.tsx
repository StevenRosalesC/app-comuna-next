'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister } from '@/interfaces/cash-register';
import ActiveCashRegister from './active-cash-register';
import OpenCashRegister from './open-cash-register';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface ActiveCashRegisterWrapperProps {
  onRefresh?: () => void;
}

export function ActiveCashRegisterWrapper({ onRefresh }: ActiveCashRegisterWrapperProps) {
  const { permissions } = usePermissionsStore();

  const canOpenCashRegister = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.OPEN_CASH_REGISTER
  ) ?? true;

  const canCloseCashRegister = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.CLOSE_CASH_REGISTER
  ) ?? true;

  const canCreateIncome = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.CREATE_INCOME
  ) ?? true;

  const canCreateExpense = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.CREATE_EXPENSE
  ) ?? true;

  const canCancelInvoice = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.CANCEL_INVOICE
  ) ?? true;

  const { data: activeRegisterData, isLoading: queryLoading } = useQuery<CashRegister | null, Error>({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister
  });

  const handleRefresh = () => {
    onRefresh?.();
  };

  if (queryLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className='h-8 w-1/3' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-48 w-full' />
        </CardContent>
      </Card>
    );
  }

  if (!activeRegisterData) {
    return (
      <OpenCashRegister
        canOpenCashRegister={canOpenCashRegister}
        onSuccess={handleRefresh}
      />
    );
  }

  return (
    <ActiveCashRegister
      activeCashRegister={activeRegisterData}
      canCloseCashRegister={canCloseCashRegister}
      canCreateIncome={canCreateIncome}
      canCreateExpense={canCreateExpense}
      canCancelInvoice={canCancelInvoice}
    />
  );
}