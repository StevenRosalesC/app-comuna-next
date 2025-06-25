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
import { receiptsService, DetailedReceiptHistoryItem } from '@/services/receipts';
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
  Clock,
  User,
  Home,
  Mail,
  Phone,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500">Pagado</Badge>;
      case 'PARTIAL':
        return <Badge className="bg-yellow-500">Parcial</Badge>;
      case 'PENDING':
        return <Badge className="bg-red-500">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className='h-64 w-full' />;
    }
    if (isError || !invoice) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Icons.warning className="h-12 w-12 text-destructive mb-4" />
          <p className='text-destructive text-center'>
            No se encontró información de la factura.
          </p>
        </div>
      );
    }
    const invoiceDate = new Date(invoice.invoiceDate);
    return (
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Factura #{invoice.invoiceId}</h3>
            </div>
            {invoice.invoiceStatus === 1 && <Badge className="bg-green-500">Pagado</Badge>}
            {invoice.invoiceStatus === 2 && <Badge className="bg-yellow-500">Pendiente</Badge>}
            {invoice.invoiceStatus === 3 && <Badge className="bg-red-500">Anulado</Badge>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>Fecha:</strong> {invoiceDate.toLocaleDateString('es-ES', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Información del miembro */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Información del Miembro
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span><strong>Nombre:</strong> {invoice.member.person.firstName} {invoice.member.person.lastName}</span>
            </div>
          </div>
        </div>
        {/* Información de la transacción */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Información de la Transacción
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span><strong>Caja Registradora:</strong> #{invoice.cashRegister.cashRegisterId}</span>
            </div>
            {invoice.collectedByUser && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span><strong>Cobrado por:</strong> {invoice.collectedByUser.person.firstName} {invoice.collectedByUser.person.lastName}</span>
              </div>
            )}
          </div>
        </div>
        {/* Detalles del pago - nueva estructura */}
        <div>
          <h4 className='font-semibold mb-3 flex items-center gap-2'>
            <FileText className="h-4 w-4" />
            Detalles del Pago
          </h4>
          <div className="rounded-md border overflow-x-auto">
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
                {invoice.invoiceFeePayments && invoice.invoiceFeePayments.length > 0 ? invoice.invoiceFeePayments.map((payment, idx) => {
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
                      <TableCell>{remaining > 0 ? `$${remaining.toFixed(2)}` : '$0.00'}</TableCell>
                      <TableCell>
                        <Badge className={
                          fee.status === 'PAID' ? 'bg-green-500' : fee.status === 'PARTIAL' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {fee.status === 'PAID' ? 'Pagado' : fee.status === 'PARTIAL' ? 'Parcial' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('es-ES') : '-'}</TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">No hay pagos registrados en esta factura</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Resumen financiero */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Resumen Financiero
          </h4>
          <div className='flex justify-end gap-4 text-right'>
            <div className='grid gap-2'>
              <p className="text-sm">Subtotal:</p>
              {invoice.discount && invoice.discount > 0 && (
                <p className="text-sm text-green-600">Descuento:</p>
              )}
              <p className='font-bold text-lg'>Total:</p>
            </div>
            <div className='grid gap-2'>
              <p className="text-sm">${invoice.subtotal.toFixed(2)}</p>
              {invoice.discount && invoice.discount > 0 && (
                <p className="text-sm text-green-600">-${invoice.discount.toFixed(2)}</p>
              )}
              <p className='font-bold text-lg'>${invoice.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleDownloadReceipt(invoice.invoiceId)}
            disabled={downloadingId !== null}
            className="flex-1"
          >
            {downloadingId === invoice.invoiceId ? (
              <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {downloadingId === invoice.invoiceId ? 'Descargando...' : 'Descargar Recibo'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleResendReceipt(invoice.invoiceId)}
            disabled={resendReceiptMutation.isPending}
            className="flex-1"
          >
            {resendReceiptMutation.isPending ? (
              <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {resendReceiptMutation.isPending ? 'Enviando...' : 'Reenviar por Email'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Detalles de la Factura
          </DialogTitle>
          <DialogDescription>
            Aquí puedes ver los detalles completos del pago realizado y realizar acciones adicionales.
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
