'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { Expense, GetExpensesParams, PaginatedExpensesResponse } from '@/interfaces/cash-register';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpensesTableProps {
  onRefresh?: () => void;
}

export function ExpensesTable({ onRefresh }: ExpensesTableProps) {
  const [filters, setFilters] = useState<GetExpensesParams>({
    limit: 10,
    offset: 0
  });

  const queryClient = useQueryClient();

  // Fetch expenses with React Query
  const {
    data: expensesData,
    isLoading,
    refetch,
  } = useQuery<PaginatedExpensesResponse, Error>({
    queryKey: ['expenses', filters],
    queryFn: () => cashRegisterService.getExpenses(filters),
  });

  const expenses = expensesData?.expenses || [];
  const total = expensesData?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 10));
  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1;

  // Cancel expense mutation
  const cancelExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => cashRegisterService.cancelExpense(expenseId),
    onSuccess: () => {
      toast.success('Gasto cancelado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onRefresh?.();
    },
    onError: (error: any) => {
      console.error('Error canceling expense:', error);
      toast.error(error.response?.data?.message || 'Error al cancelar el gasto');
    },
  });

  const handleFilterChange = (field: keyof GetExpensesParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      offset: 0 // Reset pagination when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      offset: (page - 1) * (prev.limit || 10)
    }));
  };

  const handleCancelExpense = (expenseId: string) => {
    cancelExpenseMutation.mutate(expenseId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Filtrar por descripción"
              value={filters.description || ''}
              onChange={(e) => handleFilterChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha Inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha Fin</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minAmount">Monto Mínimo</Label>
            <Input
              id="minAmount"
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAmount">Monto Máximo</Label>
            <Input
              id="maxAmount"
              type="number"
              placeholder="0"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron gastos
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Caja</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense: Expense) => (
                  <TableRow key={expense.expenseId}>
                    <TableCell>
                      {expense.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(expense.expenseDate), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {expense.cashRegister?.cashRegisterName || `Caja #${expense.cashRegisterId}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.status ? 'default' : 'secondary'}>
                        {expense.status ? 'Activo' : 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.status && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Gasto</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que quieres cancelar este gasto?
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelExpense(expense.expenseId)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 