'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { receiptsService } from '@/services/receipts';
import { getMemberFeesStatus, MemberFeeStatus } from '@/services/members';
import { useMemberQueries } from '@/hooks/use-member-queries';
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
import { Download, ExternalLink } from 'lucide-react';

interface MemberPaymentProps {
  member: Member;
}

interface FeePayment {
  memberFeeId: string;
  amountToPay: number;
}

export default function MemberPayment({ member }: MemberPaymentProps) {
  const queryClient = useQueryClient();
  const { invalidateAllMemberQueries } = useMemberQueries(member.memberId);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<{ invoiceId: string; } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: activeCashRegister, isLoading: isLoadingCashRegister } =
    useQuery({
      queryKey: ['activeCashRegister'],
      queryFn: cashRegisterService.getActiveRegister,
      retry: 1
    });

  const { data: feesStatus, isLoading: isLoadingFees } = useQuery({
    queryKey: ['memberFeesStatus', member.memberId],
    queryFn: () => getMemberFeesStatus(member.memberId),
    enabled: !!member.memberId
  });

  const pendingFees = useMemo(() => {
    if (!feesStatus?.fees) return [];
    return feesStatus.fees.filter((fee: MemberFeeStatus) =>
      (fee.status === 'PENDING' || fee.status === 'PARTIAL') &&
      fee.amountDue > fee.amountPaid
    );
  }, [feesStatus]);

  const createInvoiceMutation = useMutation({
    mutationFn: invoicingService.createInvoice,
    onSuccess: (data) => {
      toast.success('Pago registrado correctamente.');
      setPayments([]);
      setLastCreatedInvoice({
        invoiceId: data.invoiceId,
      });

      // Invalidate all member-related queries to refresh the data
      invalidateAllMemberQueries();
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

  const handleDownloadReceipt = async () => {
    if (lastCreatedInvoice) {
      setIsDownloading(true);
      toast.info('Preparando la descarga del recibo...');
      try {
        const pdf = await receiptsService.downloadReceiptPdf(lastCreatedInvoice.invoiceId);
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success('Recibo descargado exitosamente.');
      } catch (error) {
        toast.error('Error al descargar el recibo.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const clearLastInvoice = () => {
    setLastCreatedInvoice(null);
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
    <>
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
                          {fee.feeName} <br />
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

      {/* Display newly created receipt */}
      {lastCreatedInvoice && (
        <Card className='mt-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
          <CardHeader>
            <CardTitle className='text-green-800 dark:text-green-200'>
              ✅ Pago Registrado Exitosamente
            </CardTitle>
            <CardDescription className='text-green-700 dark:text-green-300'>
              El recibo ha sido generado y enviado por email al miembro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleDownloadReceipt}
                variant='outline'
                size='sm'
                className='border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900'
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Icons.spinner className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Download className='h-4 w-4 mr-2' />
                )}
                Descargar Recibo
              </Button>
              <Button
                onClick={clearLastInvoice}
                variant='ghost'
                size='sm'
                className='text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200'
              >
                Cerrar
              </Button>
            </div>
            <p className='mt-2 text-xs text-green-600 dark:text-green-400'>
              Factura #{lastCreatedInvoice.invoiceId} - El recibo también se puede descargar desde el historial de pagos.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
