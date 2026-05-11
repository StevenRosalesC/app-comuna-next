'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, type RecentMovement } from '@/services/dashboard';
import { Calendar, TrendingUp, TrendingDown, WalletMinimal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface RecentMovementsProps {
  limit?: number;
  dateRange?: string;
}

export function RecentMovements({ limit = 10, dateRange }: RecentMovementsProps) {
  const { data: movements, isLoading, isError } = useQuery<RecentMovement[]>({
    queryKey: ['dashboard-recent-movements', limit, dateRange],
    queryFn: () => dashboardService.getRecentMovements({ limit, dateRange })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>Movimientos recientes</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/cash-management">Ver caja</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !Array.isArray(movements) || movements.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>Movimientos recientes</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/cash-management">Ver caja</Link>
          </Button>
        </CardHeader>
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <WalletMinimal className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No hay movimientos recientes</p>
            <p className="text-xs text-muted-foreground">
              Los ingresos y gastos del periodo se mostrarán aquí.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/cash-management">Ir a caja</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Movimientos recientes</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/cash-management">Ver caja</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.map((movement, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center space-x-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${movement.type === 'income'
                  ? 'bg-green-100'
                  : 'bg-red-100'
                  }`}>
                  {movement.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">
                    {movement.description}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(movement.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${movement.type === 'income'
                ? 'text-green-600'
                : 'text-red-600'
                }`}>
                {movement.type === 'income' ? '+' : '-'}
                {formatAmount(movement.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
