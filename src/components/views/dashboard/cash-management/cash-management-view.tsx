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

export default function CashManagementView() {
  const {
    data: activeCashRegister,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
    retry: 1
  });

  console.log(error);
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
      return <ActiveCashRegister activeCashRegister={activeCashRegister} />;
    }

    return <OpenCashRegister />;
  };

  return (
    <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
      <div className='flex flex-row justify-between'>
        <PageTitle title='Gestión de Caja' />
        <Button variant='outline' size='sm'>
          <Link href='/dashboard/cash-management/history'>Historial</Link>
        </Button>
      </div>
      <div className='mt-6'>{renderContent()}</div>
    </div>
  );
}
