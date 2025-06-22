'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cash-register';
import { invoicingService } from '@/services/invoicing';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Member } from '@/interfaces/members';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface MemberPaymentProps {
  member: Member;
}

interface FeePayment {
  memberFeeId: string;
  amountToPay: number;
}

export default function MemberPayment({ member }: MemberPaymentProps) {
  const queryClient = useQueryClient();
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: activeCashRegister, isLoading: isLoadingCashRegister } =
    useQuery({
      queryKey: ['activeCashRegister'],
      queryFn: cashRegisterService.getActiveRegister,
      retry: 1
    });

  const createInvoiceMutation = useMutation({
    mutationFn: invoicingService.createInvoice,
    onSuccess: () => {
      toast.success('Pago registrado correctamente.');
      setPayments([]);
      queryClient.invalidateQueries({ queryKey: ['members', member.memberId] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log({ error });
      toast.error(
        error.response?.data?.message || 'Error al registrar el pago.'
      );
    }
  });

  const pendingFees = useMemo(
    () =>
      member?.memberFees?.filter(
        (fee) =>
          (fee.status === 'PENDING' || fee.status === 'PARTIAL') &&
          fee.amountDue > fee.amountPaid
      ) || [],
    [member]
  );

  const totalAmountToPay = useMemo(() => {
    return payments.reduce((acc, payment) => acc + payment.amountToPay, 0);
  }, [payments]);

  const handlePaymentInputChange = (memberFeeId: string, amount: string) => {
    const amountToPay = parseFloat(amount) || 0;
    const fee = pendingFees.find((f) => f.memberFeeId === memberFeeId);
    if (!fee) return;

    const remainingBalance = fee.amountDue - fee.amountPaid;
    if (amountToPay > remainingBalance) {
      toast.warning(
        `El monto no puede exceder el saldo de $${remainingBalance.toFixed(2)}`
      );
      return;
    }

    setPayments((prev) => {
      const existingPayment = prev.find((p) => p.memberFeeId === memberFeeId);
      if (existingPayment) {
        return prev.map((p) =>
          p.memberFeeId === memberFeeId ? { ...p, amountToPay } : p
        );
      } else {
        return [...prev, { memberFeeId, amountToPay }];
      }
    });
  };

  const handlePay = () => {
    const feesToPay = payments.filter((p) => p.amountToPay > 0);
    if (feesToPay.length === 0) {
      toast.warning('Debes ingresar un monto a pagar para al menos una cuota.');
      return;
    }
    createInvoiceMutation.mutate({
      memberId: member.memberId,
      cashRegisterId: activeCashRegister!.cashRegisterId,
      fees: feesToPay
    });
  };

  if (pendingFees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos de Cuotas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            El miembro no tiene cuotas pendientes de pago.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos de Cuotas</CardTitle>
        <CardDescription>
          El miembro tiene cuotas pendientes. Haz clic en &quot;Realizar
          Pago&quot; para abonar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingCashRegister ? (
          <Skeleton className='h-10 w-36' />
        ) : activeCashRegister ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Realizar Pago</Button>
            </DialogTrigger>
            <DialogContent className='max-w-lg'>
              <DialogHeader>
                <DialogTitle>Realizar Pago Parcial o Completo</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                {pendingFees.map((fee) => {
                  const remainingBalance = fee.amountDue - fee.amountPaid;
                  return (
                    <div
                      key={fee.memberFeeId}
                      className='grid grid-cols-3 items-center gap-4'
                    >
                      <label
                        htmlFor={fee.memberFeeId}
                        className='col-span-1 text-sm'
                      >
                        {fee.annualFee.name} <br />
                        <span className='text-xs text-muted-foreground'>
                          Saldo: ${remainingBalance.toFixed(2)}
                        </span>
                      </label>
                      <Input
                        id={fee.memberFeeId}
                        type='number'
                        placeholder='0.00'
                        className='col-span-2'
                        onChange={(e) =>
                          handlePaymentInputChange(
                            fee.memberFeeId,
                            e.target.value
                          )
                        }
                        max={remainingBalance.toFixed(2)}
                        step='0.01'
                      />
                    </div>
                  );
                })}
              </div>
              <div className='mt-4 text-lg font-bold'>
                Total a pagar: ${totalAmountToPay.toFixed(2)}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='ghost'>Cancelar</Button>
                </DialogClose>
                <Button
                  onClick={handlePay}
                  disabled={
                    createInvoiceMutation.isPending || totalAmountToPay === 0
                  }
                >
                  {createInvoiceMutation.isPending
                    ? 'Procesando Pago...'
                    : 'Confirmar y Pagar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Alert variant='default'>
            <Icons.warning className='h-4 w-4' />
            <AlertTitle>No hay caja activa</AlertTitle>
            <AlertDescription>
              Es necesario abrir una caja en el módulo de &quot;Gestión de
              Caja&quot; para poder registrar pagos.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
