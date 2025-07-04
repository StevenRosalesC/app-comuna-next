'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { CreateIncomeDto, CashRegister } from '@/interfaces/cash-register';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateIncomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateIncomeForm({ onSuccess, onCancel }: CreateIncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateIncomeDto>({
    description: '',
    amount: 0,
    incomeDate: new Date().toISOString().split('T')[0],
    expense_code: undefined,
    cashRegisterId: 0
  });

  // Get active cash register with React Query
  const { data: activeRegister, isLoading: isLoadingRegister } = useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
  });

  const queryClient = useQueryClient();

  // Mutation to create income
  const createIncomeMutation = useMutation({
    mutationFn: (formData: CreateIncomeDto) => cashRegisterService.createIncome(formData),
    onSuccess: () => {
      toast.success('Ingreso registrado exitosamente en la caja activa');
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar el ingreso');
    },
  });

  // Update cashRegisterId when active cash register is obtained
  const handleInputChange = (field: keyof CreateIncomeDto, value: string | number | undefined) => {
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
    createIncomeMutation.mutate(formData);
  };

  if (!activeRegister) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar Ingreso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No hay una caja registradora abierta. Debes abrir una caja antes de registrar ingresos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registrar Ingreso</CardTitle>
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
              placeholder="Descripción del ingreso"
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
            <Label htmlFor="incomeDate">Fecha</Label>
            <Input
              id="incomeDate"
              type="date"
              value={formData.incomeDate}
              onChange={(e) => handleInputChange('incomeDate', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_code">Código de Categoría</Label>
            <Input
              id="expense_code"
              type="number"
              placeholder="Código opcional"
              value={formData.expense_code || ''}
              onChange={(e) => handleInputChange('expense_code', parseInt(e.target.value) || undefined)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
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