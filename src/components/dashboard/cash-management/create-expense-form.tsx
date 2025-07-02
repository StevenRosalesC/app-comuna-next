'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { CreateExpenseDto, CashRegister } from '@/interfaces/cash-register';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateExpenseForm({ onSuccess, onCancel }: CreateExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateExpenseDto>({
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    cashRegisterId: 0
  });

  // Obtener caja activa con React Query
  const { data: activeRegister, isLoading: isLoadingRegister } = useQuery<CashRegister | null, Error>({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
  });

  const queryClient = useQueryClient();

  // Mutación para crear gasto
  const createExpenseMutation = useMutation({
    mutationFn: (formData: CreateExpenseDto) => cashRegisterService.createExpense(formData),
    onSuccess: () => {
      toast.success('Gasto registrado exitosamente en la caja activa');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar el gasto');
    },
  });

  const handleInputChange = (field: keyof CreateExpenseDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRegister) {
      toast.error('No hay una caja registradora abierta');
      return;
    }
    if (formData.amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    createExpenseMutation.mutate(formData);
  };

  if (!activeRegister) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay una caja registradora abierta. Debes abrir una caja antes de registrar gastos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registrar Gasto</CardTitle>
        <p className="text-sm text-muted-foreground">
          Caja activa: {activeRegister.cashRegisterName || `Caja #${activeRegister.cashRegisterId}`}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del gasto"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenseDate">Fecha</Label>
            <Input
              id="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => handleInputChange('expenseDate', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Registrando...' : 'Registrar Gasto'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 