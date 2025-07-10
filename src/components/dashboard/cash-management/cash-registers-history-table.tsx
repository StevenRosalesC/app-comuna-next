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
import { CashRegister, PaginatedCashRegistersResponse } from '@/interfaces/cash-register';
import { CashRegistersHistoryTableRowSkeleton } from './cash-registers-history-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Icons } from '@/components/icons';
import { RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function CashRegistersHistoryTable() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date()
  });

  const [filters] = useState({
    limit: 10,
    offset: 0,
    startDate: undefined,
    endDate: undefined,
  });

  const { data, isLoading, refetch, isError } = useQuery<PaginatedCashRegistersResponse, Error>({
    queryKey: ['cashRegistersHistory', filters],
    queryFn: () => cashRegisterService.getCashRegisters(filters),
  });
  const cashRegisters = data?.cashRegisters || [];
  const total = data?.total || 0;

  const pageCount = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
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
            disabled={isLoading}
          >
            {isLoading ? (
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
                          variant={
                            register.closed ? 'destructive' : 'secondary'
                          }
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
