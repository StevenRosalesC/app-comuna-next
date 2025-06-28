'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { invoicingService } from '@/services/invoicing';
import { receiptsService } from '@/services/receipts';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import {
  Calendar,
  User,
  DollarSign,
  CreditCard,
  Download,
  Send,
  FileText,
  Receipt,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface InvoiceDetailsDialogProps {
  invoiceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Skeleton component for better loading experience
function InvoiceDetailsSkeleton() {
  return (
    <div className='min-w-full space-y-6'>
      {/* Header Skeleton */}
      <div className='rounded-lg bg-muted/30 p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5' />
            <Skeleton className='h-6 w-32' />
          </div>
          <Skeleton className='h-6 w-16' />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-48' />
          </div>
        </div>
      </div>

      {/* Member Information Skeleton */}
      <div className='rounded-lg bg-muted/30 p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-5 w-40' />
        </div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-56' />
          </div>
        </div>
      </div>

      {/* Transaction Information Skeleton */}
      <div className='rounded-lg bg-muted/30 p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-5 w-44' />
        </div>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-52' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-48' />
          </div>
        </div>
      </div>

      {/* Payment Details Skeleton */}
      <div>
        <div className='mb-3 flex items-center gap-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-5 w-36' />
        </div>
        <div className='overflow-x-auto rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className='h-4 w-16' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-12' /></TableHead>
                <TableHead><Skeleton className='h-4 w-24' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-16' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-6 w-16 rounded-full' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Financial Summary Skeleton */}
      <div className='rounded-lg bg-muted/30 p-4'>
        <div className='mb-3 flex items-center gap-2'>
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-5 w-36' />
        </div>
        <div className='flex justify-end gap-4 text-right'>
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-5 w-12' />
          </div>
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className='flex flex-col gap-2 sm:flex-row'>
        <Skeleton className='h-10 flex-1' />
        <Skeleton className='h-10 flex-1' />
      </div>
    </div>
  );
}

export function InvoiceDetailsDialog({
  invoiceId,
  open,
  onOpenChange
}: InvoiceDetailsDialogProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const {
    data: invoice,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoicingService.getInvoiceById(invoiceId!),
    enabled: !!invoiceId
  });

  const resendReceiptMutation = useMutation({
    mutationFn: receiptsService.resendReceipt,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Recibo reenviado exitosamente por email');
      } else {
        toast.warning(response.message);
      }
    },
    onError: () => {
      toast.error('Error al reenviar el recibo');
    }
  });

  const handleDownloadReceipt = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    toast.info('Preparando la descarga del recibo...');
    try {
      const pdf = await receiptsService.downloadReceiptPdf(invoiceId);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('Recibo descargado exitosamente.');
    } catch (error) {
      toast.error('Error al descargar el recibo.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResendReceipt = (invoiceId: string) => {
    resendReceiptMutation.mutate(invoiceId);
  };

  const renderContent = () => {
    if (isLoading) {
      return <InvoiceDetailsSkeleton />;
    }
    if (isError || !invoice) {
      return (
        <div className='flex flex-col items-center justify-center py-8'>
          <Icons.warning className='mb-4 h-12 w-12 text-destructive' />
          <p className='text-center text-destructive'>
            No se encontró información de la factura.
          </p>
        </div>
      );
    }
    const invoiceDate = new Date(invoice.invoiceDate);
    return (
      <div className='min-w-full space-y-6'>
        {/* Header */}
        <div className='rounded-lg bg-muted/30 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Receipt className='h-5 w-5 text-primary' />
              <h3 className='text-lg font-semibold'>
                Factura #{invoice.invoiceId}
              </h3>
            </div>
            {invoice.invoiceStatus === 1 && (
              <Badge className='bg-green-500'>Pagado</Badge>
            )}
            {invoice.invoiceStatus === 2 && (
              <Badge className='bg-yellow-500'>Pendiente</Badge>
            )}
            {invoice.invoiceStatus === 3 && (
              <Badge className='bg-red-500'>Anulado</Badge>
            )}
          </div>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span>
                <strong>Fecha:</strong>{' '}
                {invoiceDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Member information */}
        <div className='rounded-lg bg-muted/30 p-4'>
          <h4 className='mb-3 flex items-center gap-2 font-semibold'>
            <User className='h-4 w-4' />
            Información del Comunero
          </h4>
          <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-muted-foreground' />
              <span>
                <strong>Nombre:</strong> {invoice.member.person.firstName}{' '}
                {invoice.member.person.lastName}
              </span>
            </div>
          </div>
        </div>
        {/* Transaction information */}
        <div className='rounded-lg bg-muted/30 p-4'>
          <h4 className='mb-3 flex items-center gap-2 font-semibold'>
            <CreditCard className='h-4 w-4' />
            Información de la Transacción
          </h4>
          <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
            <div className='flex items-center gap-2'>
              <Building className='h-4 w-4 text-muted-foreground' />
              <span>
                <strong>Caja Registradora:</strong> #
                {invoice.cashRegister.cashRegisterId}
              </span>
            </div>
            {invoice.collectedByUser && (
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span>
                  <strong>Cobrado por:</strong>{' '}
                  {invoice.collectedByUser.person.firstName}{' '}
                  {invoice.collectedByUser.person.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Payment details */}
        <div>
          <h4 className='mb-3 flex items-center gap-2 font-semibold'>
            <FileText className='h-4 w-4' />
            Detalles del Pago
          </h4>
          <div className='overflow-x-auto rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Pago en esta factura</TableHead>
                  <TableHead>Total pagado</TableHead>
                  <TableHead>Monto a pagar</TableHead>
                  <TableHead>Saldo pendiente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.invoiceFeePayments &&
                  invoice.invoiceFeePayments.length > 0 ? (
                  invoice.invoiceFeePayments.map((payment, idx) => {
                    const fee = payment.memberFee;
                    const remaining = fee.amountDue - fee.amountPaid;
                    return (
                      <TableRow key={payment.invoiceFeePaymentId}>
                        <TableCell>{fee.annualFee.name}</TableCell>
                        <TableCell>{fee.annualFee.description}</TableCell>
                        <TableCell>{fee.annualFee.year}</TableCell>
                        <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                        <TableCell>${fee.amountPaid.toFixed(2)}</TableCell>
                        <TableCell>${fee.amountDue.toFixed(2)}</TableCell>
                        <TableCell>
                          {remaining > 0 ? `$${remaining.toFixed(2)}` : '$0.00'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              fee.status === 'PAID'
                                ? 'bg-green-500'
                                : fee.status === 'PARTIAL'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }
                          >
                            {fee.status === 'PAID'
                              ? 'Pagado'
                              : fee.status === 'PARTIAL'
                                ? 'Parcial'
                                : 'Pendiente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString(
                              'es-ES'
                            )
                            : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className='text-center'>
                      No hay pagos registrados en esta factura
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Financial summary */}
        <div className='rounded-lg bg-muted/30 p-4'>
          <h4 className='mb-3 flex items-center gap-2 font-semibold'>
            <DollarSign className='h-4 w-4' />
            Resumen Financiero
          </h4>
          <div className='flex justify-end gap-4 text-right'>
            <div className='grid gap-2'>
              <p className='text-sm'>Subtotal:</p>
              {invoice.discount && invoice.discount > 0 && (
                <p className='text-sm text-green-600'>Descuento:</p>
              )}
              <p className='text-lg font-bold'>Total:</p>
            </div>
            <div className='grid gap-2'>
              <p className='text-sm'>${invoice.subtotal.toFixed(2)}</p>
              {invoice.discount && invoice.discount > 0 && (
                <p className='text-sm text-green-600'>
                  -${invoice.discount.toFixed(2)}
                </p>
              )}
              <p className='text-lg font-bold'>
                ${invoice.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button
            variant='outline'
            onClick={() => handleDownloadReceipt(invoice.invoiceId)}
            disabled={downloadingId !== null}
            className='flex-1'
          >
            {downloadingId === invoice.invoiceId ? (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Download className='mr-2 h-4 w-4' />
            )}
            {downloadingId === invoice.invoiceId
              ? 'Descargando...'
              : 'Descargar Recibo'}
          </Button>
          <Button
            variant='outline'
            onClick={() => handleResendReceipt(invoice.invoiceId)}
            disabled={resendReceiptMutation.isPending}
            className='flex-1'
          >
            {resendReceiptMutation.isPending ? (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Send className='mr-2 h-4 w-4' />
            )}
            {resendReceiptMutation.isPending
              ? 'Enviando...'
              : 'Reenviar por Email'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] w-full overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Receipt className='h-5 w-5' />
            Detalles de la Factura
          </DialogTitle>
          <DialogDescription>
            Aquí puedes ver los detalles completos del pago realizado y realizar
            acciones adicionales.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
