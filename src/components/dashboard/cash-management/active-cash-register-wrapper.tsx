'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister } from '@/interfaces/cash-register';
import ActiveCashRegister from './active-cash-register';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ActiveCashRegisterWrapperProps {
  onRefresh?: () => void;
}

export function ActiveCashRegisterWrapper({ onRefresh }: ActiveCashRegisterWrapperProps) {
  const { data: activeRegisterData, isLoading: queryLoading } = useQuery<CashRegister | null, Error>({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister,
  });

  const handleRefresh = () => {
    onRefresh?.();
  };

  if (queryLoading) {
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

  if (!activeRegisterData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Caja</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No hay una caja registradora abierta
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Abre una caja para poder registrar ingresos y gastos
          </p>
          <Button onClick={handleRefresh}>
            <Plus className="h-4 w-4 mr-2" />
            Abrir Caja
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ActiveCashRegister
      activeCashRegister={activeRegisterData}
      canCloseCashRegister={true}
      canCreateIncome={true}
      canCreateExpense={true}
      canReadIncome={true}
      canReadExpense={true}
      canDeletePayment={true}
      canDeleteIncome={true}
      canDeleteExpense={true}
      canCancelInvoice={true}
    />
  );
} 