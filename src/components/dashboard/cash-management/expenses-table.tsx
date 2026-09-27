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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { Expense, GetExpensesParams, PaginatedExpensesResponse } from '@/interfaces/cash-register';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, X, RotateCw, Trash2, TrendingDown, Calendar, Tag, DollarSign } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';

interface ExpensesTableProps {
  onRefresh?: () => void;
}

export function ExpensesTable({ onRefresh }: ExpensesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [cancelExpenseId, setCancelExpenseId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const filters: GetExpensesParams = {
    limit: pageSize,
    offset: pageIndex * pageSize
  };

  // Fetch expenses
  const {
    data: expensesData,
    isLoading,
    refetch,
    isFetching
  } = useQuery<PaginatedExpensesResponse, Error>({
    queryKey: ['expenses', filters],
    queryFn: () => cashRegisterService.getExpenses(filters)
  });

  const expenses = expensesData?.expenses || [];
  const total = expensesData?.total || 0;
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  // Filter expenses by search term
  const filteredExpenses = expenses.filter((expense: Expense) => {
    if (!debouncedSearch) return true;
    return (
      expense.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      expense.amount?.toString().includes(debouncedSearch)
    );
  });

  // Cancel expense mutation
  const cancelExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => cashRegisterService.cancelExpense(expenseId),
    onSuccess: () => {
      toast.success('Gasto cancelado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      setCancelExpenseId(null);
      onRefresh?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al cancelar el gasto');
    }
  });

  return (
    <div className='space-y-4'>
      {/* Search & Refresh Toolbar */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='relative w-full sm:w-80'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar gasto por descripción o monto...'
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
              <TableHead className='font-semibold text-xs'>Caja</TableHead>
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
            ) : filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-xs text-muted-foreground'>
                  No se encontraron gastos registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense: Expense) => (
                <TableRow key={expense.expenseId} className='hover:bg-muted/30'>
                  <TableCell className='font-medium text-xs text-foreground'>
                    {expense.description}
                  </TableCell>
                  <TableCell className='text-xs text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                      <span>
                        {expense.expenseDate
                          ? format(new Date(expense.expenseDate), 'dd/MM/yyyy', { locale: es })
                          : '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-xs'>
                    {expense.cashRegister?.cashRegisterName ? (
                      <Badge variant='outline' className='text-[10px]'>
                        <Tag className='h-3 w-3 mr-1 text-muted-foreground' />
                        {expense.cashRegister.cashRegisterName}
                      </Badge>
                    ) : (
                      <span className='text-muted-foreground text-xs'>-</span>
                    )}
                  </TableCell>
                  <TableCell className='font-bold text-xs text-rose-600 dark:text-rose-400'>
                    -${Number(expense.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={expense.status === false ? 'destructive' : 'outline'}
                      className='text-[10px]'
                    >
                      {expense.status === false ? 'Cancelado' : 'Registrado'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {expense.status !== false && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setCancelExpenseId(expense.expenseId)}
                        title='Cancelar gasto'
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
        isOpen={!!cancelExpenseId}
        onClose={() => setCancelExpenseId(null)}
        onConfirm={() => {
          if (cancelExpenseId) {
            cancelExpenseMutation.mutate(cancelExpenseId);
          }
        }}
        loading={cancelExpenseMutation.isPending}
        confirmText='Cancelar Gasto'
        cancelText='Volver'
        title='¿Estás seguro de cancelar este gasto?'
        description='Esta acción anulará el egreso y reintegrará el importe a la caja activa.'
      />
    </div>
  );
}