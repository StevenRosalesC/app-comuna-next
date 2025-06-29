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
import { Download, DollarSign, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<{
    invoiceId: string;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: activeCashRegister, isLoading: isLoadingCashRegister } =
    useQuery({
      queryKey: ['activeCashRegister'],
      queryFn: cashRegisterService.getActiveRegister,
      retry: 1
    });

  const { data: feesStatus } = useQuery({
    queryKey: ['memberFeesStatus', member.memberId],
    queryFn: () => getMemberFeesStatus(member.memberId),
    enabled: !!member.memberId
  });

  const pendingFees = useMemo(() => {
    if (!feesStatus?.fees) return [];
    return feesStatus.fees.filter(
      (fee: MemberFeeStatus) =>
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
        invoiceId: data.invoiceId
      });

      // Invalidate all member-related queries to refresh the data
      invalidateAllMemberQueries();
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });

      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Error al registrar el pago.'
      );
    }
  });

  const totalAmountToPay = useMemo(() => {
    return payments.reduce((acc, payment) => acc + payment.amountToPay, 0);
  }, [payments]);

  const totalPendingAmount = useMemo(() => {
    return pendingFees.reduce((acc, fee) => acc + (fee.amountDue - fee.amountPaid), 0);
  }, [pendingFees]);

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

  const handlePayFullAmount = () => {
    const fullPayments = pendingFees.map((fee) => ({
      memberFeeId: fee.memberFeeId,
      amountToPay: fee.amountDue - fee.amountPaid
    }));
    setPayments(fullPayments);
  };

  const handleClearPayments = () => {
    setPayments([]);
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
        const pdf = await receiptsService.downloadReceiptPdf(
          lastCreatedInvoice.invoiceId
        );
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

  const getPaymentStatus = (fee: MemberFeeStatus) => {
    const payment = payments.find((p) => p.memberFeeId === fee.memberFeeId);
    if (!payment || payment.amountToPay === 0) return 'none';
    const remainingBalance = fee.amountDue - fee.amountPaid;
    if (payment.amountToPay === remainingBalance) return 'full';
    return 'partial';
  };

  if (pendingFees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos de Cuotas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p>El comunero no tiene cuotas pendientes de pago.</p>
          </div>
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
            El comunero tiene {pendingFees.length} cuota{pendingFees.length > 1 ? 's' : ''} pendiente{pendingFees.length > 1 ? 's' : ''} por un total de ${totalPendingAmount.toFixed(2)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCashRegister ? (
            <Skeleton className='h-10 w-36' />
          ) : activeCashRegister ? (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Realizar Pago
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Realizar Pago de Cuotas
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Selecciona los montos a pagar para cada cuota pendiente
                  </p>
                </DialogHeader>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePayFullAmount}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Pagar Todo (${totalPendingAmount.toFixed(2)})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearPayments}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Limpiar Montos
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Fees List */}
                <div className='space-y-4'>
                  {pendingFees.map((fee) => {
                    const remainingBalance = fee.amountDue - fee.amountPaid;
                    const payment = payments.find((p) => p.memberFeeId === fee.memberFeeId);
                    const paymentStatus = getPaymentStatus(fee);

                    return (
                      <div
                        key={fee.memberFeeId}
                        className={`p-4 rounded-lg border-2 transition-all ${paymentStatus === 'full'
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                          : paymentStatus === 'partial'
                            ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                            : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{fee.feeName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Saldo pendiente: ${remainingBalance.toFixed(2)}
                              </span>
                              {paymentStatus !== 'none' && (
                                <Badge
                                  variant={paymentStatus === 'full' ? 'default' : 'secondary'}
                                  className={paymentStatus === 'full' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                >
                                  {paymentStatus === 'full' ? 'Pago completo' : 'Pago parcial'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Total: ${fee.amountDue.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Pagado: ${fee.amountPaid.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={payment?.amountToPay || ''}
                              onChange={(e) =>
                                handlePaymentInputChange(
                                  fee.memberFeeId,
                                  e.target.value
                                )
                              }
                              max={remainingBalance.toFixed(2)}
                              step="0.01"
                              className="text-right"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaymentInputChange(fee.memberFeeId, remainingBalance.toString())}
                            className="text-xs"
                          >
                            Máximo
                          </Button>
                        </div>

                        {payment && payment.amountToPay > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Monto a pagar: ${payment.amountToPay.toFixed(2)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total a pagar:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${totalAmountToPay.toFixed(2)}
                    </span>
                  </div>
                  {totalAmountToPay > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {payments.filter(p => p.amountToPay > 0).length} cuota{payments.filter(p => p.amountToPay > 0).length > 1 ? 's' : ''} seleccionada{payments.filter(p => p.amountToPay > 0).length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant='ghost'>Cancelar</Button>
                  </DialogClose>
                  <Button
                    onClick={handlePay}
                    disabled={
                      createInvoiceMutation.isPending || totalAmountToPay === 0
                    }
                    className="min-w-[140px]"
                  >
                    {createInvoiceMutation.isPending ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Confirmar Pago
                      </>
                    )}
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
            <CardTitle className='text-green-800 dark:text-green-200 flex items-center gap-2'>
              <CheckCircle className="h-5 w-5" />
              Pago Registrado Exitosamente
            </CardTitle>
            <CardDescription className='text-green-700 dark:text-green-300'>
              El recibo ha sido generado y enviado por email al comunero.
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
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Download className='mr-2 h-4 w-4' />
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
              Factura #{lastCreatedInvoice.invoiceId} - El recibo también se
              puede descargar desde el historial de pagos.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
