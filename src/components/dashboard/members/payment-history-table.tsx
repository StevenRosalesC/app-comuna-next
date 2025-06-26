'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { receiptsService, DetailedReceiptHistoryItem } from '@/services/receipts';
import { InvoiceSummary } from '@/interfaces/invoicing';
import { useMemberQueries } from '@/hooks/use-member-queries';
import { InvoiceHistoryTableRowSkeleton } from './invoice-history-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { InvoiceDetailsDialog } from './invoice-details-dialog';
import { Icons } from '@/components/icons';
import { RefreshCw, Download, Mail, FileText, MoreHorizontal, Calendar, DollarSign, User, Home, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PaymentHistoryTableProps {
  memberId: string;
}

export function PaymentHistoryTable({ memberId }: PaymentHistoryTableProps) {
  const queryClient = useQueryClient();
  const { invalidateMemberInvoicesQueries } = useMemberQueries(memberId);
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date()
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [invoiceToResend, setInvoiceToResend] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    setPageIndex(0);
  }, [dateRange]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['memberInvoices', { memberId, pageIndex, pageSize, dateRange }],
    queryFn: () =>
      invoicingService.getInvoicesByMemberId({
        memberId,
        limit: pageSize,
        offset: pageIndex * pageSize,
        startDate: dateRange?.from?.toISOString().split('T')[0],
        endDate: dateRange?.to?.toISOString().split('T')[0],
        includeDetails: true
      })
  });

  const { data: detailedReceipts } = useQuery({
    queryKey: ['detailedReceipts', memberId, pageIndex, pageSize],
    queryFn: () => receiptsService.getDetailedReceiptHistory({
      memberId,
      limit: pageSize,
      offset: pageIndex * pageSize
    }),
    enabled: !!memberId
  });

  const resendReceiptMutation = useMutation({
    mutationFn: receiptsService.resendReceipt,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Recibo reenviado exitosamente por email');
      } else {
        toast.warning(response.message);
      }
      setResendDialogOpen(false);
      setInvoiceToResend(null);

      // Invalidate invoice-related queries to refresh data
      invalidateMemberInvoicesQueries();
    },
    onError: () => {
      toast.error('Error al reenviar el recibo');
      setResendDialogOpen(false);
      setInvoiceToResend(null);
    }
  });

  const invoices = useMemo(() => data?.invoices ?? [], [data]);
  const totalCount = useMemo(() => data?.total ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const handleDownloadReceipt = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    toast.info('Preparando la descarga del recibo...');
    try {
      const pdf = await receiptsService.downloadReceiptPdf(invoiceId);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('Recibo descargado exitosamente.');

      // Invalidate invoice-related queries to refresh data
      invalidateMemberInvoicesQueries();
    } catch (error) {
      toast.error('Error al descargar el recibo.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleResendReceipt = (invoiceId: string) => {
    setInvoiceToResend(invoiceId);
    setResendDialogOpen(true);
  };

  const confirmResendReceipt = () => {
    if (invoiceToResend) {
      resendReceiptMutation.mutate(invoiceToResend);
    }
  };

  const toggleRowExpansion = (invoiceId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(invoiceId)) {
      newExpandedRows.delete(invoiceId);
    } else {
      newExpandedRows.add(invoiceId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-500">Pagado</Badge>;
      case 2:
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 3:
        return <Badge className="bg-red-500">Anulado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getFeeStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500">Pagado</Badge>;
      case 'PARTIAL':
        return <Badge className="bg-yellow-500">Parcial</Badge>;
      case 'PENDING':
        return <Badge className="bg-red-500">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDetailedReceipt = (invoiceId: string): DetailedReceiptHistoryItem | undefined => {
    return detailedReceipts?.find(receipt => receipt.invoiceId === invoiceId);
  };

  const handleRowExpansion = (invoiceId: string) => {
    toggleRowExpansion(invoiceId);
  };

  if (isError) {
    toast.error('Error al cargar el historial de pagos.');
    return (
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se pudo cargar el historial.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Estos son los pagos registrados para el comunero. Puedes descargar recibos, reenviarlos por email y ver detalles expandidos.
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
                  <TableHead></TableHead>
                  <TableHead># Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto Pagado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, i) => (
                    <InvoiceHistoryTableRowSkeleton key={i} />
                  ))
                  : invoices.length > 0
                    ? invoices.map((invoice: InvoiceSummary) => {
                      const detailedReceipt = getDetailedReceipt(invoice.invoiceId);
                      const isExpanded = expandedRows.has(invoice.invoiceId);

                      return (
                        <React.Fragment key={invoice.invoiceId}>
                          <TableRow>
                            <TableCell>
                              {detailedReceipt && (
                                <Collapsible open={isExpanded} onOpenChange={() => handleRowExpansion(invoice.invoiceId)}>
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      {isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </Collapsible>
                              )}
                            </TableCell>
                            <TableCell className='font-medium'>
                              #{invoice.invoiceId}
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              {detailedReceipt ? getStatusBadge(detailedReceipt.invoiceStatus) : '-'}
                            </TableCell>
                            <TableCell className='text-right'>
                              <div className='flex items-center justify-end gap-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    setSelectedInvoiceId(invoice.invoiceId)
                                  }
                                >
                                  <FileText className='h-4 w-4 mr-1' />
                                  Detalles
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='outline' size='sm'>
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                      onClick={() => handleDownloadReceipt(invoice.invoiceId)}
                                      disabled={downloadingId !== null}
                                    >
                                      {downloadingId === invoice.invoiceId ? (
                                        <Icons.spinner className='h-4 w-4 mr-2 animate-spin' />
                                      ) : (
                                        <Download className='h-4 w-4 mr-2' />
                                      )}
                                      Descargar Recibo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleResendReceipt(invoice.invoiceId)}
                                    >
                                      <Mail className='h-4 w-4 mr-2' />
                                      Reenviar por Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={6} className="p-0">
                                <Collapsible open={isExpanded}>
                                  <CollapsibleContent>
                                    <InvoiceExpandedDetails invoiceId={invoice.invoiceId} invoices={invoices} />
                                  </CollapsibleContent>
                                </Collapsible>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                    : !isLoading && (
                      <TableRow>
                        <TableCell colSpan={6} className='h-24 text-center'>
                          No hay pagos en el rango de fechas seleccionado.
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

      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reenviar Recibo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres reenviar el recibo por email?
              Esto enviará el PDF del recibo al email registrado del comunero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResendReceipt}
              disabled={resendReceiptMutation.isPending}
            >
              {resendReceiptMutation.isPending ? (
                <>
                  <Icons.spinner className='h-4 w-4 mr-2 animate-spin' />
                  Enviando...
                </>
              ) : (
                'Reenviar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function InvoiceExpandedDetails({ invoiceId, invoices }: { invoiceId: string; invoices: any[] }) {
  const invoice = invoices.find(inv => inv.invoiceId === invoiceId);

  if (!invoice || !invoice.invoiceFeePayments) {
    return <div className="p-4 text-sm text-red-600">No se encontraron detalles de la factura.</div>;
  }

  return (
    <div className="bg-muted/30 p-4 space-y-3">
      <div className="font-semibold mb-2">Pagos de esta factura:</div>
      <div className="overflow-x-auto">
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
            {invoice.invoiceFeePayments && invoice.invoiceFeePayments.length > 0 ? invoice.invoiceFeePayments.map((payment: any) => {
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
  );
}
