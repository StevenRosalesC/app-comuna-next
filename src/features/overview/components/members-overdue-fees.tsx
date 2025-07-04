'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type MemberOverdueFee } from '@/services/dashboard';
import { Calendar, User, AlertTriangle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface MembersOverdueFeesProps {
  limit?: number;
  dateRange?: string;
}

export function MembersOverdueFees({ limit = 5, dateRange }: MembersOverdueFeesProps) {
  const { data: members, isLoading, isError } = useQuery<MemberOverdueFee[]>({
    queryKey: ['dashboard-members-overdue-fees', limit, dateRange],
    queryFn: () => dashboardService.getMembersOverdueFees({ limit, dateRange })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Miembros con cuotas atrasadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !Array.isArray(members) || members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Miembros con cuotas atrasadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay miembros con cuotas atrasadas</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'PAID':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Pagado</Badge>;
      case 'OVERDUE':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Atrasado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Miembros con cuotas atrasadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member, index) => {
            const daysOverdue = getDaysOverdue(member.dueDate);
            return (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {member.name}
                    </h4>
                    {getStatusBadge(member.status)}
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-semibold text-red-600">
                        {formatAmount(member.amountDue)}
                      </span>
                    </div>
                    {daysOverdue > 0 && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          {daysOverdue} días de atraso
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Vence: {formatDate(member.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 