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
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister, PaginatedCashRegistersResponse } from '@/interfaces/cash-register';
import { CashRegistersHistoryTableRowSkeleton } from './cash-registers-history-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RotateCw, Eye, Calendar, User, DollarSign, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function CashRegistersHistoryTable() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date()
  });

  const filters = useMemo(() => {
    return {
      limit: pageSize,
      offset: pageIndex * pageSize,
      startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
    };
  }, [pageSize, pageIndex, dateRange]);

  const { data, isLoading, refetch, isFetching } = useQuery<PaginatedCashRegistersResponse, Error>({
    queryKey: ['cashRegistersHistory', filters],
    queryFn: () => cashRegisterService.getCashRegisters(filters)
  });

  const cashRegisters = data?.cashRegisters || [];
  const total = data?.total || 0;
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <div className='space-y-4'>
      {/* Date Filter Toolbar */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <DateRangePicker
            date={dateRange}
            onDateChange={(range) => {
              setDateRange(range);
              setPageIndex(0);
            }}
            className='w-full sm:w-auto'
          />
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            disabled={isFetching}
            className='h-9 text-xs'
          >
            <RotateCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='rounded-xl border bg-card overflow-hidden shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/40'>
              <TableHead className='font-semibold text-xs'># Caja</TableHead>
              <TableHead className='font-semibold text-xs'>Apertura</TableHead>
              <TableHead className='font-semibold text-xs'>Cierre</TableHead>
              <TableHead className='font-semibold text-xs'>Monto Inicial</TableHead>
              <TableHead className='font-semibold text-xs'>Monto Final</TableHead>
              <TableHead className='font-semibold text-xs'>Estado</TableHead>
              <TableHead className='text-right font-semibold text-xs'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <CashRegistersHistoryTableRowSkeleton key={i} />
              ))
            ) : cashRegisters.length > 0 ? (
              cashRegisters.map((register: CashRegister) => {
                const isOpen = !register.closed;
                const initial = Number(register.initialAmount || 0);
                const finalVal = register.finalAmount != null ? Number(register.finalAmount) : null;

                return (
                  <TableRow key={register.cashRegisterId} className='hover:bg-muted/30'>
                    <TableCell className='font-semibold text-xs'>
                      <div className='flex items-center gap-2'>
                        <Receipt className='h-4 w-4 text-muted-foreground' />
                        <span>#{register.cashRegisterId}</span>
                      </div>
                    </TableCell>

                    <TableCell className='text-xs'>
                      <div className='space-y-0.5'>
                        <div className='flex items-center gap-1.5 text-foreground font-medium'>
                          <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                          <span>
                            {format(new Date(register.openDate), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        {register.openedByUser && (
                          <p className='text-[11px] text-muted-foreground'>
                            Por: {register.openedByUser.person.firstName} {register.openedByUser.person.lastName}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className='text-xs'>
                      {register.closeDate ? (
                        <div className='space-y-0.5'>
                          <div className='flex items-center gap-1.5 text-foreground font-medium'>
                            <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                            <span>
                              {format(new Date(register.closeDate), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </span>
                          </div>
                          {register.closedByUser && (
                            <p className='text-[11px] text-muted-foreground'>
                              Por: {register.closedByUser.person.firstName} {register.closedByUser.person.lastName}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className='text-xs text-muted-foreground italic'>En curso</span>
                      )}
                    </TableCell>

                    <TableCell className='font-medium text-xs'>
                      ${initial.toFixed(2)}
                    </TableCell>

                    <TableCell className='font-bold text-xs text-foreground'>
                      {finalVal != null ? `$${finalVal.toFixed(2)}` : '-'}
                    </TableCell>

                    <TableCell>
                      {isOpen ? (
                        <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'>
                          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
                          Abierta
                        </span>
                      ) : (
                        <Badge variant='secondary' className='text-[10px]'>
                          Cerrada
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm' asChild className='h-8 text-xs'>
                        <Link href={`/dashboard/cash-management/history/${register.cashRegisterId}`}>
                          <Eye className='mr-1.5 h-3.5 w-3.5' />
                          Detalles
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center text-xs text-muted-foreground'>
                  No se encontraron cajas en el rango de fechas seleccionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='pt-2'>
        <DataTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
