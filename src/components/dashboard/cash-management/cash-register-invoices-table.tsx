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
import { InvoiceSummary } from '@/interfaces/invoicing';
import { CashRegisterInvoicesTableRowSkeleton } from './cash-register-invoices-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { InvoiceDetailsDialog } from '@/components/dashboard/members/invoice-details-dialog';
import { Icons } from '@/components/icons';
import { RefreshCw } from 'lucide-react';

interface CashRegisterInvoicesTableProps {}

export function CashRegisterInvoicesTable({}: CashRegisterInvoicesTableProps) {
  const [pageSize, setPageSize] = useState(5);
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
    queryKey: ['cashRegisterInvoices', { pageIndex, pageSize, dateRange }],
    queryFn: () =>
      invoicingService.getInvoicesByCashRegisterId({
        limit: pageSize,
        offset: pageIndex * pageSize,
        startDate: dateRange?.from?.toISOString().split('T')[0],
        endDate: dateRange?.to?.toISOString().split('T')[0]
      })
  });

  const invoices = useMemo(() => data?.invoices ?? [], [data]);
  const totalCount = useMemo(() => data?.total ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

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
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, i) => (
                      <CashRegisterInvoicesTableRowSkeleton key={i} />
                    ))
                  : invoices.length > 0
                  ? invoices.map((invoice: InvoiceSummary) => (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell className='font-medium'>
                          #{invoice.invoiceId}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              setSelectedInvoiceId(invoice.invoiceId)
                            }
                          >
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : !isLoading && (
                      <TableRow>
                        <TableCell colSpan={4} className='h-24 text-center'>
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
