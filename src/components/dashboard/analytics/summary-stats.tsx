'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  Accessibility,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface SummaryStatsProps {
  summary: {
    totalPersons: number;
    totalMembers: number;
    totalWithDisability: number;
    totalWithPendingFees: number;
    averageAge: number;
    membershipRate: string;
    disabilityRate: string;
  };
}

export const SummaryStats = ({ summary }: SummaryStatsProps) => {
  const stats = [
    {
      title: 'Total de personas',
      value: summary.totalPersons.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Comuneros activos',
      value: summary.totalMembers.toLocaleString(),
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Con discapacidad',
      value: summary.totalWithDisability.toLocaleString(),
      icon: Accessibility,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Cuotas pendientes',
      value: summary.totalWithPendingFees.toLocaleString(),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Edad promedio',
      value: `${summary.averageAge} años`,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Tasa de comuneros',
      value: summary.membershipRate,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 