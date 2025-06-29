'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { invoicingService } from '@/services/invoicing';
import { CashRegisterInvoicesTableRowSkeleton } from './cash-register-invoices-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { InvoiceDetailsDialog } from '@/components/dashboard/members/invoice-details-dialog';
import { Icons } from '@/components/icons';
import { Eye, RefreshCw, Trash } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface CashRegisterInvoicesTableProps {
  cashRegisterId: string;
  canCancelInvoice?: boolean;
  onDeleteInvoice?: () => void;
}

export function CashRegisterInvoicesTable({
  cashRegisterId,
  canCancelInvoice = false,
  onDeleteInvoice = () => { },
}: CashRegisterInvoicesTableProps) {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState('');
  const [invoiceToCancel, setInvoiceToCancel] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const hasCancelInvoicePermission = usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.CANCEL_INVOICE
  ]);

  React.useEffect(() => {
    setPageIndex(0);
  }, [dateRange]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['cashRegisterInvoices', { pageIndex, pageSize, dateRange }],
    queryFn: () =>
      invoicingService.getInvoicesByCashRegisterId({
        cashRegisterId,
        limit: pageSize,
        offset: pageIndex * pageSize,
        startDate: dateRange?.from?.toISOString().split('T')[0],
        endDate: dateRange?.to?.toISOString().split('T')[0]
      })
  });

  const cancelInvoiceMutation = useMutation({
    mutationFn: ({ invoiceId, reason }: { invoiceId: string; reason: string }) =>
      invoicingService.cancelInvoice(invoiceId, { reason }),
    onSuccess: () => {
      toast.success('Factura cancelada correctamente');
      queryClient.invalidateQueries({ queryKey: ['cashRegisterInvoices'] });
      setCancelReason('');
      setInvoiceToCancel(null);
      onDeleteInvoice();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cancelar la factura');
    }
  });

  const invoices = useMemo(() => data?.invoices ?? [], [data]);
  const totalCount = useMemo(() => data?.total ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const canCancelInvoiceById = (invoice: any) => {
    if (!hasCancelInvoicePermission || !canCancelInvoice) return false;

    // Check if invoice is already cancelled
    if (invoice.invoiceStatus === 0) return false;

    // Check if invoice is within 48 hours
    const invoiceDate = new Date(invoice.invoiceDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 48;
  };

  const handleCancelInvoice = () => {
    if (invoiceToCancel) {
      cancelInvoiceMutation.mutate({
        invoiceId: invoiceToCancel,
        reason: cancelReason
      });
    }
  };

  if (isError) {
    toast.error('Error al cargar las facturas de la caja.');
    return (
      <CardContent>
        <p>No se pudo cargar el historial de facturas.</p>
      </CardContent>
    );
  }

  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Facturas de la Caja</CardTitle>
          <CardDescription>
            Estas son las facturas registradas en la caja activa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-2'>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className='max-w-sm'
            />
            <Button
              variant='outline'
              size='icon'
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
            >
              {isRefetching || isLoading ? (
                <Icons.spinner className='h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='h-4 w-4' />
              )}
            </Button>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead># Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto Pagado</TableHead>
                  <TableHead>Comunero</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, i) => (
                    <CashRegisterInvoicesTableRowSkeleton key={i} />
                  ))
                  : invoices.length > 0
                    ? invoices.map((invoice) => (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell className='font-medium'>
                          #{invoice.invoiceId}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          {invoice.member.person.firstName}{' '}
                          {invoice.member.person.lastName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={invoice.invoiceStatus === 0 ? 'destructive' : 'default'}
                          >
                            {invoice.invoiceStatus === 0 ? 'Cancelada' : 'Activa'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            {canCancelInvoiceById(invoice) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() => setInvoiceToCancel(invoice.invoiceId)}
                                  >
                                    <Trash className='h-4 w-4' />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Cancelar factura #{invoice.invoiceId}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción cancelará la factura y revertirá todos los pagos asociados.
                                      Solo se pueden cancelar facturas dentro de las primeras 48 horas.
                                      <div className='mt-4'>
                                        <label className='text-sm font-medium'>
                                          Motivo de cancelación (opcional):
                                        </label>
                                        <Textarea
                                          value={cancelReason}
                                          onChange={(e) => setCancelReason(e.target.value)}
                                          placeholder='Especifica el motivo de la cancelación...'
                                          className='mt-2'
                                          maxLength={500}
                                        />
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleCancelInvoice}
                                      disabled={cancelInvoiceMutation.isPending}
                                    >
                                      {cancelInvoiceMutation.isPending ? 'Cancelando...' : 'Confirmar'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                setSelectedInvoiceId(invoice.invoiceId)
                              }
                            >
                              <Eye className='h-4 w-4' />
                            </Button>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                    : (
                      <TableRow>
                        <TableCell colSpan={6} className='h-24 text-center'>
                          No hay facturas en el rango de fechas seleccionado.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
          <div className='mt-4'>
            <DataTablePagination
              pageIndex={pageIndex}
              pageCount={pageCount}
              pageSize={pageSize}
              isLoading={isLoading}
              onPageIndexChange={setPageIndex}
              onPageSizeChange={setPageSize}
            />
          </div>
        </CardContent>
      </Card>

      <InvoiceDetailsDialog
        invoiceId={selectedInvoiceId}
        open={selectedInvoiceId !== null}
        onOpenChange={() => setSelectedInvoiceId(null)}
      />
    </>
  );
}
