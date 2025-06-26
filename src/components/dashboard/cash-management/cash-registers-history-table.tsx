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
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister } from '@/interfaces/cash-register';
import { CashRegistersHistoryTableRowSkeleton } from './cash-registers-history-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Icons } from '@/components/icons';
import { RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function CashRegistersHistoryTable() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date()
  });

  React.useEffect(() => {
    setPageIndex(0);
  }, [dateRange]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['cashRegisters', { pageIndex, pageSize, dateRange }],
    queryFn: () =>
      cashRegisterService.getCashRegisters({
        limit: pageSize,
        offset: pageIndex * pageSize,
        startDate: dateRange?.from?.toISOString().split('T')[0],
        endDate: dateRange?.to?.toISOString().split('T')[0]
      })
  });

  const cashRegisters = useMemo(() => data?.cashRegisters ?? [], [data]);
  const totalCount = useMemo(() => data?.total ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  if (isError) {
    toast.error('Error al cargar el historial de cajas.');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cajas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No se pudo cargar el historial.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Cajas</CardTitle>
        <CardDescription>
          Aquí puedes ver todas las cajas que han sido manejadas en el sistema.
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
                <TableHead># Caja</TableHead>
                <TableHead>Abierta por</TableHead>
                <TableHead>Cerrada por</TableHead>
                <TableHead>Fecha Apertura</TableHead>
                <TableHead>Fecha Cierre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: pageSize }).map((_, i) => (
                  <CashRegistersHistoryTableRowSkeleton key={i} />
                ))
                : cashRegisters.length > 0
                  ? cashRegisters.map((register: CashRegister) => (
                    <TableRow key={register.cashRegisterId}>
                      <TableCell className='font-medium'>
                        #{register.cashRegisterId}
                      </TableCell>
                      <TableCell>
                        {register.openedByUser
                          ? `${register.openedByUser.person.firstName} ${register.openedByUser.person.lastName}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {register.closedByUser
                          ? `${register.closedByUser.person.firstName} ${register.closedByUser.person.lastName}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(register.openDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {register.closeDate
                          ? new Date(register.closeDate).toLocaleString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={register.closed ? 'destructive' : 'secondary'}
                        >
                          {register.closed ? 'Cerrada' : 'Abierta'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button variant='outline' size='sm' asChild>
                          <Link
                            href={`/dashboard/cash-management/history/${register.cashRegisterId}`}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            Ver Detalles
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                  : !isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className='h-24 text-center'>
                        No hay cajas en el rango de fechas seleccionado.
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
  );
}
