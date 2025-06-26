'use client';

import { cashRegisterService } from '@/services/cash-register';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { PageTitle } from '@/components/ui/page-title';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CashRegisterInvoicesTable } from '@/components/dashboard/cash-management/cash-register-invoices-table';
import { Badge } from '@/components/ui/badge';

export default function CashRegisterDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const {
    data: cashRegister,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['cashRegister', params.id],
    queryFn: () => cashRegisterService.getCashRegisterById(params.id)
  });

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
        <Skeleton className='h-8 w-1/3' />
        <Skeleton className='mt-4 h-48 w-full' />
        <Skeleton className='mt-6 h-96 w-full' />
      </div>
    );
  }

  if (isError || !cashRegister) {
    notFound();
  }

  return (
    <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
      <PageTitle title={`Detalles de Caja #${cashRegister.cashRegisterId}`} />
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Información General</span>
            <Badge variant={cashRegister.closed ? 'secondary' : 'default'}>
              {cashRegister.closed ? 'Cerrada' : 'Abierta'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Resumen de la apertura y cierre de la caja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-muted-foreground'>Abierta por</p>
              <p className='font-semibold'>
                {cashRegister.openedByUser
                  ? `${cashRegister.openedByUser.person.firstName} ${cashRegister.openedByUser.person.lastName}`
                  : 'N/A'}
              </p>
            </div>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-muted-foreground'>Fecha de Apertura</p>
              <p className='font-semibold'>
                {new Date(cashRegister.openDate).toLocaleString()}
              </p>
            </div>
            <div className='rounded-lg bg-muted p-3'>
              <p className='text-muted-foreground'>Monto Inicial</p>
              <p className='font-semibold'>
                ${cashRegister.initialAmount.toFixed(2)}
              </p>
            </div>

            {cashRegister.closedByUser && (
              <>
                <div className='rounded-lg bg-muted p-3'>
                  <p className='text-muted-foreground'>Cerrada por</p>
                  <p className='font-semibold'>
                    {cashRegister.closedByUser.person.firstName}{' '}
                    {cashRegister.closedByUser.person.lastName}
                  </p>
                </div>
                <div className='rounded-lg bg-muted p-3'>
                  <p className='text-muted-foreground'>Fecha de Cierre</p>
                  <p className='font-semibold'>
                    {cashRegister.closeDate
                      ? new Date(cashRegister.closeDate).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div className='rounded-lg bg-muted p-3'>
                  <p className='text-muted-foreground'>Monto Final</p>
                  <p className='font-semibold'>
                    ${cashRegister.finalAmount?.toFixed(2) ?? 'N/A'}
                  </p>
                </div>
              </>
            )}

            <div className='rounded-lg bg-muted p-3 md:col-span-2 lg:col-span-3'>
              <p className='text-muted-foreground'>Notas</p>
              <p className='font-semibold'>{cashRegister.notes || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <CashRegisterInvoicesTable cashRegisterId={cashRegister.cashRegisterId} />
    </div>
  );
}
