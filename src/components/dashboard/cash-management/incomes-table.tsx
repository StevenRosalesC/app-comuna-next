'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, X, RotateCw, Trash2, TrendingUp, Calendar, Tag, DollarSign, Loader2 } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';

interface IncomesTableProps {
  onRefresh?: () => void;
}

export function IncomesTable({ onRefresh }: IncomesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [cancelIncomeId, setCancelIncomeId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Get active cash register
  const { data: activeRegister } = useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister
  });

  // Get incomes with filters
  const {
    data: incomesData,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['incomes', pageIndex, pageSize, debouncedSearch, activeRegister?.cashRegisterId],
    queryFn: () =>
      cashRegisterService.getIncomes({
        limit: pageSize,
        offset: pageIndex * pageSize,
        cashRegisterId: activeRegister ? Number(activeRegister.cashRegisterId) : undefined
      }),
    enabled: !!activeRegister?.cashRegisterId
  });

  const incomes = incomesData?.incomes || [];
  const total = incomesData?.total || 0;
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  // Filter local incomes by search term if API does not filter on client
  const filteredIncomes = incomes.filter((income: any) => {
    if (!debouncedSearch) return true;
    return (
      income.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      income.amount?.toString().includes(debouncedSearch)
    );
  });

  // Cancel income mutation
  const cancelIncomeMutation = useMutation({
    mutationFn: (incomeId: string) => cashRegisterService.cancelIncome(incomeId),
    onSuccess: () => {
      toast.success('Ingreso anulado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      setCancelIncomeId(null);
      onRefresh?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al anular el ingreso');
    }
  });

  return (
    <div className='space-y-4'>
      {/* Search & Refresh Toolbar */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar ingreso por descripción o monto...'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(0);
            }}
            className='pl-9 pr-8 h-9 text-xs sm:text-sm'
          />
          {searchTerm && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSearchTerm('')}
              className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground'
            >
              <X className='h-3.5 w-3.5' />
            </Button>
          )}
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
              <TableHead className='font-semibold text-xs'>Descripción</TableHead>
              <TableHead className='font-semibold text-xs'>Fecha</TableHead>
              <TableHead className='font-semibold text-xs'>Categoría</TableHead>
              <TableHead className='font-semibold text-xs'>Monto</TableHead>
              <TableHead className='font-semibold text-xs'>Estado</TableHead>
              <TableHead className='text-right font-semibold text-xs'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className='py-3'>
                    <div className='h-5 w-full bg-muted/60 rounded animate-pulse' />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredIncomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-xs text-muted-foreground'>
                  No se encontraron ingresos registrados en esta sesión.
                </TableCell>
              </TableRow>
            ) : (
              filteredIncomes.map((income: any) => (
                <TableRow key={income.incomeId} className='hover:bg-muted/30'>
                  <TableCell className='font-medium text-xs text-foreground'>
                    {income.description}
                  </TableCell>
                  <TableCell className='text-xs text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                      <span>
                        {income.incomeDate
                          ? format(new Date(income.incomeDate), 'dd/MM/yyyy', { locale: es })
                          : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-xs'>
                    {income.expense_code ? (
                      <Badge variant='outline' className='text-[10px] font-mono'>
                        <Tag className='h-3 w-3 mr-1 text-muted-foreground' />
                        {income.expense_code}
                      </Badge>
                    ) : (
                      <span className='text-muted-foreground text-xs'>-</span>
                    )}
                  </TableCell>
                  <TableCell className='font-bold text-xs text-emerald-600 dark:text-emerald-400'>
                    +${Number(income.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={income.status === false ? 'destructive' : 'outline'}
                      className='text-[10px]'
                    >
                      {income.status === false ? 'Anulado' : 'Registrado'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {income.status !== false && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setCancelIncomeId(income.incomeId)}
                        title='Anular ingreso'
                        className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
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

      {/* Cancel Confirmation Modal */}
      <AlertModal
        isOpen={!!cancelIncomeId}
        onClose={() => setCancelIncomeId(null)}
        onConfirm={() => {
          if (cancelIncomeId) {
            cancelIncomeMutation.mutate(cancelIncomeId);
          }
        }}
        loading={cancelIncomeMutation.isPending}
        confirmText='Anular Ingreso'
        cancelText='Cancelar'
        title='¿Estás seguro de anular este ingreso?'
        description='Esta acción descontará el monto de la caja activa y quedará registrada en la auditoría.'
      />
    </div>
  );
}