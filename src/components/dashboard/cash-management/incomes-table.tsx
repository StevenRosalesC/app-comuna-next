'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, RefreshCw, X } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface IncomesTableProps {
  onRefresh?: () => void;
}

export function IncomesTable({ onRefresh }: IncomesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeRegister, setActiveRegister] = useState<any>(null);

  const queryClient = useQueryClient();

  // Get active cash register
  useEffect(() => {
    const fetchActiveRegister = async () => {
      try {
        const register = await cashRegisterService.getActiveRegister();
        setActiveRegister(register);
      } catch (error) {
        console.error('Error fetching active register:', error);
      }
    };

    fetchActiveRegister();
  }, []);

  // Get incomes with filters
  const {
    data: incomesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['incomes', pageIndex, pageSize, searchTerm, activeRegister?.cashRegisterId],
    queryFn: () => cashRegisterService.getIncomes({
      limit: pageSize,
      offset: pageIndex * pageSize,
      cashRegisterId: activeRegister ? Number(activeRegister.cashRegisterId) : undefined,
    }),
    enabled: !!activeRegister?.cashRegisterId,
  });

  const incomes = incomesData?.incomes || [];
  const total = incomesData?.total || 0;
  const pageCount = Math.ceil(total / pageSize);

  // Cancel income mutation
  const cancelIncomeMutation = useMutation({
    mutationFn: (incomeId: string) => cashRegisterService.cancelIncome(incomeId),
    onSuccess: () => {
      toast.success('Ingreso anulado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      onRefresh?.();
    },
    onError: (error: any) => {
      console.error('Error cancelling income:', error);
      toast.error(error.response?.data?.message || 'Error al anular el ingreso');
    },
  });

  const handleCancelIncome = (incomeId: string) => {
    cancelIncomeMutation.mutate(incomeId);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPageIndex(0); // Reset to first page when searching
  };

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  if (!activeRegister) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingresos</CardTitle>
          <CardDescription>
            No hay una caja activa para mostrar ingresos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Debes abrir una caja para poder registrar y ver ingresos
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ingresos Registrados</CardTitle>
            <CardDescription>
              Ingresos registrados en la caja activa: {activeRegister.cashRegisterName || `Caja #${activeRegister.cashRegisterId}`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and filters */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descripción..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-8">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
          </div>
        ) : incomes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No se encontraron ingresos con esa descripción' : 'No se encontraron ingresos'}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.map((income) => (
                  <TableRow key={income.incomeId}>
                    <TableCell>
                      {income.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      ${income.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(income.incomeDate), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {income.expense_code ? (
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {income.expense_code}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={income.incomeStatus === 1 ? 'default' : 'secondary'}>
                        {income.incomeStatus === 1 ? 'Activo' : 'Anulado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {income.incomeStatus === 1 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              Anular
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Anular ingreso?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción marcará el ingreso como anulado.
                                ¿Estás seguro de que deseas continuar?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelIncome(income.incomeId)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Anular Ingreso
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

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {pageIndex * pageSize + 1} a {Math.min((pageIndex + 1) * pageSize, total)} de {total} ingresos
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                    disabled={pageIndex === 0}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {pageIndex + 1} de {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
                    disabled={pageIndex === pageCount - 1}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 