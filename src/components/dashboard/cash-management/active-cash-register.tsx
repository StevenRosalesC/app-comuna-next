'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CashRegister } from '@/interfaces/cash-register';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cash-register';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { CashRegisterInvoicesTable } from './cash-register-invoices-table';

interface ActiveCashRegisterProps {
  activeCashRegister: CashRegister;
  canCloseCashRegister?: boolean;
  canCreateIncome?: boolean;
  canCreateExpense?: boolean;
  canReadIncome?: boolean;
  canReadExpense?: boolean;
  canDeletePayment?: boolean;
  canDeleteIncome?: boolean;
  canDeleteExpense?: boolean;
  canCancelInvoice?: boolean;
}

export default function ActiveCashRegister({
  activeCashRegister,
  canCloseCashRegister = false,
  canCreateIncome = false,
  canCreateExpense = false,
  canReadIncome = false,
  canReadExpense = false,
  canDeletePayment = false,
  canDeleteIncome = false,
  canDeleteExpense = false,
  canCancelInvoice = false
}: ActiveCashRegisterProps) {
  const queryClient = useQueryClient();

  const closeRegisterMutation = useMutation({
    mutationFn: (id: string) => cashRegisterService.closeRegister(id, {}),
    onSuccess: () => {
      toast.success('Caja cerrada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Error al cerrar la caja.');
    }
  });

  const handleCloseRegister = () => {
    // TODO: Add a confirmation dialog before closing
    closeRegisterMutation.mutate(activeCashRegister.cashRegisterId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hay una Caja Activa</CardTitle>
          <CardDescription>
            Mientras esta caja esté abierta, se podrán registrar pagos en el
            sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-2'>
            <div>
              <p className='text-sm font-semibold text-muted-foreground'>
                Abierta por
              </p>
              <p>
                {activeCashRegister.openedByUser?.person.firstName}{' '}
                {activeCashRegister.openedByUser?.person.lastName}
              </p>
            </div>
            <div>
              <p className='text-sm font-semibold text-muted-foreground'>
                Fecha de Apertura
              </p>
              <p>{new Date(activeCashRegister.openDate).toLocaleString()}</p>
            </div>
            <div>
              <p className='text-sm font-semibold text-muted-foreground'>
                Monto Inicial
              </p>
              <p>${activeCashRegister.initialAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className='text-sm font-semibold text-muted-foreground'>
                Monto Actual
              </p>
              <p className='font-bold'>
                ${activeCashRegister.finalAmount?.toFixed(2) ?? 'N/A'}
              </p>
            </div>
            {activeCashRegister.notes && (
              <div className='sm:col-span-2'>
                <p className='text-sm font-semibold text-muted-foreground'>
                  Notas de Apertura
                </p>
                <p className='text-sm italic'>
                  &quot;{activeCashRegister.notes}&quot;
                </p>
              </div>
            )}
          </div>
          <Alert>
            <Icons.warning className='h-4 w-4' />
            <AlertTitle>Acción Requerida</AlertTitle>
            <AlertDescription className='flex items-center justify-between'>
              <span>
                Para finalizar la sesión de cobros, cierra la caja. Esta acción
                no se puede deshacer.
              </span>
              {canCloseCashRegister && (
                <Button
                  variant='destructive'
                  onClick={handleCloseRegister}
                  disabled={closeRegisterMutation.isPending}
                >
                  <Icons.close className='mr-2 h-4 w-4' />
                  {closeRegisterMutation.isPending
                    ? 'Cerrando...'
                    : 'Cerrar Caja'}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <CashRegisterInvoicesTable
        cashRegisterId={activeCashRegister.cashRegisterId}
        canCancelInvoice={canCancelInvoice}
        onDeleteInvoice={() => {
          queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
        }}
      />
    </>
  );
}
