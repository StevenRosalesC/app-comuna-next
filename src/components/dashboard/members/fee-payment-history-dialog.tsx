'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { getMemberFeePayments, MemberFeePaymentsResponse } from '@/services/members';
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
import { Icons } from '@/components/icons';
import {
  Calendar,
  DollarSign,
  User,
  Building,
  Receipt
} from 'lucide-react';

interface FeePaymentHistoryDialogProps {
  memberId: string;
  memberFeeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeePaymentHistoryDialog({
  memberId,
  memberFeeId,
  open,
  onOpenChange
}: FeePaymentHistoryDialogProps) {
  const { data: feePayments, isLoading, isError } = useQuery({
    queryKey: ['memberFeePayments', memberId, memberFeeId],
    queryFn: () => getMemberFeePayments(memberId, memberFeeId!),
    enabled: !!memberId && !!memberFeeId && open
  });

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className='h-64 w-full' />;
    }

    if (isError || !feePayments) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Icons.warning className="h-12 w-12 text-destructive mb-4" />
          <p className='text-destructive text-center'>
            No se pudo cargar el historial de pagos de la cuota.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with fee information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{feePayments.feeName}</h3>
            </div>
            <Badge className={
              feePayments.status === 'PAID' ? 'bg-green-500' :
                feePayments.status === 'PARTIAL' ? 'bg-yellow-500' : 'bg-red-500'
            }>
              {feePayments.status === 'PAID' ? 'Pagado' :
                feePayments.status === 'PARTIAL' ? 'Parcial' : 'Pendiente'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span><strong>Monto total:</strong> ${feePayments.amountDue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span><strong>Total pagado:</strong> ${feePayments.totalAmountPaid.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span><strong>Saldo pendiente:</strong> ${feePayments.remainingBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment history */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Historial de Pagos
          </h4>

          {feePayments.payments && feePayments.payments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Monto pagado</TableHead>
                    <TableHead>Fecha de pago</TableHead>
                    <TableHead>Cobrado por</TableHead>
                    <TableHead>Caja registradora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feePayments.payments.map((payment) => (
                    <TableRow key={payment.invoiceFeePaymentId}>
                      <TableCell className="font-medium">
                        #{payment.invoiceId}
                      </TableCell>
                      <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {payment.collectedBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {payment.cashRegisterName}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay pagos registrados para esta cuota.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Pagos de Cuota</DialogTitle>
          <DialogDescription>
            Detalle completo de todos los pagos realizados para esta cuota.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
} 