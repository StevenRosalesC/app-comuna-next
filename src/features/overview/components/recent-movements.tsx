'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type RecentMovement } from '@/services/dashboard';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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
        <CardHeader>
          <CardTitle>Movimientos recientes</CardTitle>
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
        <CardHeader>
          <CardTitle>Movimientos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay movimientos recientes</p>
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
      <CardHeader>
        <CardTitle>Movimientos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.map((movement, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
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
                <span className="text-sm font-semibold text-red-600">
                  {formatAmount(movement.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 