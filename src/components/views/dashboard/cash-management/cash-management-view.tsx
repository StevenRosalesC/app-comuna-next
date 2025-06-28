'use client';

import { cashRegisterService } from '@/services/cash-register';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import OpenCashRegister from '@/components/dashboard/cash-management/open-cash-register';
import ActiveCashRegister from '@/components/dashboard/cash-management/active-cash-register';
import { PageTitle } from '@/components/ui/page-title';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';

export default function CashManagementView() {

  // Permission checks for cash management
  const canReadCashManagement = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.READ
  ]);
  const canOpenCashRegister = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.OPEN_CASH_REGISTER
  ]);
  const canCloseCashRegister = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.CLOSE_CASH_REGISTER
  ]);
  const canViewHistory = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.VIEW_HISTORY
  ]);
  const canCreateIncome = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.CREATE_INCOME
  ]);
  const canCreateExpense = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.CREATE_EXPENSE
  ]);
  const canReadIncome = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.READ_INCOME
  ]);
  const canReadExpense = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.READ_EXPENSE
  ]);
  const canDeletePayment = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.DELETE_PAYMENT
  ]);
  const canDeleteIncome = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.DELETE_INCOME
  ]);
  const canDeleteExpense = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.DELETE_EXPENSE
  ]);

  const {
    data: activeCashRegister,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
    retry: 1,
    enabled: canReadCashManagement // Only fetch if user has read permission
  });

  // If user doesn't have read permission, show access denied
  if (!canReadCashManagement) {
    return (
      <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
        <div className='rounded-md border border-destructive bg-destructive/10 p-4'>
          <p className='text-destructive'>
            No tienes permisos para acceder a la gestión de caja.
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='mt-4 h-48 w-full' />
        </>
      );
    }

    if (isError) {
      return (
        <div className='rounded-md border border-destructive bg-destructive/10 p-4'>
          <p className='text-destructive'>
            Error al cargar la información de la caja. Por favor, recargue la
            página.
          </p>
        </div>
      );
    }

    if (activeCashRegister) {
      return (
        <ActiveCashRegister
          activeCashRegister={activeCashRegister}
          canCloseCashRegister={canCloseCashRegister}
          canCreateIncome={canCreateIncome}
          canCreateExpense={canCreateExpense}
          canReadIncome={canReadIncome}
          canReadExpense={canReadExpense}
          canDeletePayment={canDeletePayment}
          canDeleteIncome={canDeleteIncome}
          canDeleteExpense={canDeleteExpense}
        />
      );
    }

    return <OpenCashRegister canOpenCashRegister={canOpenCashRegister} />;
  };

  return (
    <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
      <div className='flex flex-row justify-between'>
        <PageTitle title='Gestión de Caja' />
        {canViewHistory && (
          <Button variant='outline' size='sm'>
            <Link href='/dashboard/cash-management/history'>Historial</Link>
          </Button>
        )}
      </div>
      <div className='mt-6'>{renderContent()}</div>
    </div>
  );
}
