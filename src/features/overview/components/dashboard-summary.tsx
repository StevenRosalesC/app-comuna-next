'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type DashboardSummary } from '@/services/dashboard';
import { Users, UserCheck, FileText, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function DashboardSummary() {
  const { data: summary, isLoading, isError } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardService.getSummary
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(7)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Error al cargar los datos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: 'Miembros totales',
      value: summary.totalMembers,
      icon: Users,
      description: 'Miembros activos de la comunidad',
      color: 'text-blue-600'
    },
    {
      title: 'Usuarios totales',
      value: summary.totalUsers,
      icon: UserCheck,
      description: 'Usuarios del sistema',
      color: 'text-green-600'
    },
    {
      title: 'Cuotas anuales',
      value: summary.totalAnnualFees,
      icon: FileText,
      description: 'Total de cuotas anuales',
      color: 'text-purple-600'
    },
    {
      title: 'Cuotas pagadas',
      value: summary.totalPaidFees,
      icon: TrendingUp,
      description: 'Cuotas pagadas exitosamente',
      color: 'text-emerald-600'
    },
    {
      title: 'Cuotas pendientes',
      value: summary.totalPendingFees,
      icon: AlertCircle,
      description: 'Cuotas pendientes de pago',
      color: 'text-orange-600'
    },
    {
      title: 'Ingresos totales',
      value: `$${summary.totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      description: 'Total de ingresos en este periodo',
      color: 'text-green-600'
    },
    {
      title: 'Gastos totales',
      value: `$${summary.totalExpense.toLocaleString()}`,
      icon: TrendingDown,
      description: 'Total de gastos en este periodo',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 