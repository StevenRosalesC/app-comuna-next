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
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Icons } from '@/components/icons';
import { RefreshCw, Eye } from 'lucide-react';
import { InvoiceDetailsDialog } from '@/components/dashboard/members/invoice-details-dialog';

interface CancelledInvoicesTableProps {
  canViewCancelledInvoices?: boolean;
}

export function CancelledInvoicesTable({
  canViewCancelledInvoices = false
}: CancelledInvoicesTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  React.useEffect(() => {
    setPageIndex(0);
  }, [dateRange]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['cancelledInvoices', { pageIndex, pageSize, dateRange }],
    queryFn: () =>
      invoicingService.getCancelledInvoices({
        limit: pageSize,
        offset: pageIndex * pageSize,
        startDate: dateRange?.from?.toISOString().split('T')[0],
        endDate: dateRange?.to?.toISOString().split('T')[0]
      }),
    enabled: canViewCancelledInvoices
  });

  const invoices = useMemo(() => data?.invoices ?? [], [data]);
  const totalCount = useMemo(() => data?.total ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  if (isError) {
    toast.error('Error al cargar las facturas canceladas.');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Facturas Canceladas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se pudo cargar el historial de facturas canceladas.</p>
        </CardContent>
      </Card>
    );
  }

  if (!canViewCancelledInvoices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes permisos para ver las facturas canceladas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Contacta al administrador para obtener los permisos necesarios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Facturas Canceladas</CardTitle>
          <CardDescription>
            Historial de todas las facturas que han sido canceladas en el sistema.
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
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Fecha Cancelación</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comunero</TableHead>
                  <TableHead>Cancelado por</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className='h-5 w-20 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-24 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-24 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-16 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-32 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-32 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell>
                        <div className='h-5 w-40 animate-pulse bg-gray-200 rounded' />
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='h-8 w-24 animate-pulse bg-gray-200 rounded ml-auto' />
                      </TableCell>
                    </TableRow>
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
                        <TableCell>
                          {invoice.cancelledAt
                            ? new Date(invoice.cancelledAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          {invoice.member.person.firstName}{' '}
                          {invoice.member.person.lastName}
                        </TableCell>
                        <TableCell>
                          {invoice.cancelledBy
                            ? `${invoice.cancelledBy.person.firstName} ${invoice.cancelledBy.person.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className='text-sm text-muted-foreground'>
                            {invoice.cancellationReason || 'Sin motivo'}
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              setSelectedInvoiceId(invoice.invoiceId)
                            }
                          >
                            <Eye className='h-4 w-4' />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                    : (
                      <TableRow>
                        <TableCell colSpan={8} className='h-24 text-center'>
                          No hay facturas canceladas en el rango de fechas seleccionado.
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