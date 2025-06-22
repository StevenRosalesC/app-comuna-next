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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const {
    data: invoice,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoicingService.getInvoiceById(invoiceId!),
    enabled: !!invoiceId
  });

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className='h-64 w-full' />;
    }

    if (isError || !invoice) {
      return (
        <p className='text-destructive'>
          Error al cargar los detalles de la factura.
        </p>
      );
    }

    return (
      <div>
        <div className='mb-4 grid grid-cols-2 gap-4 text-sm'>
          <p>
            <strong>Miembro:</strong> {invoice.member.person.firstName}{' '}
            {invoice.member.person.lastName}
          </p>
          <p>
            <strong>Fecha:</strong>{' '}
            {new Date(invoice.invoiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong># Factura:</strong> {invoice.invoiceId}
          </p>
          <p>
            <strong>Caja:</strong> #{invoice.cashRegister.cashRegisterId}
          </p>
          {invoice.collectedByUser && (
            <p>
              <strong>Cobrado por:</strong>{' '}
              {invoice.collectedByUser.person.firstName}{' '}
              {invoice.collectedByUser.person.lastName}
            </p>
          )}
        </div>

        <h4 className='mb-2 font-bold'>Detalles del Pago</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cuota</TableHead>
              <TableHead className='text-right'>Monto Pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.memberFees.map((fee) => (
              <TableRow key={fee.memberFeeId}>
                <TableCell>
                  <div className='font-medium'>{fee.annualFee.name}</div>
                  <div className='text-muted-foreground'>
                    Año: {fee.annualFee.year}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  ${fee.amountPaid.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='mt-4 flex justify-end gap-4 text-right font-medium'>
          <div className='grid gap-0.5'>
            <p>Subtotal:</p>
            <p>Descuento:</p>
            <p className='font-bold'>Total:</p>
          </div>
          <div className='grid gap-0.5'>
            <p>${invoice.subtotal.toFixed(2)}</p>
            <p>-${(invoice.discount || 0).toFixed(2)}</p>
            <p className='font-bold'>${invoice.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detalles de la Factura</DialogTitle>
          <DialogDescription>
            Aquí puedes ver los detalles completos del pago realizado.
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
