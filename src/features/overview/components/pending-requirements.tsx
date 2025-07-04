'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type PendingRequirement } from '@/services/dashboard';
import { Calendar, User, FileText, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface PendingRequirementsProps {
  limit?: number;
  dateRange?: string;
}

export function PendingRequirements({ limit = 5, dateRange }: PendingRequirementsProps) {
  const { data: requirements, isLoading, isError } = useQuery<PendingRequirement[]>({
    queryKey: ['dashboard-pending-requirements', limit, dateRange],
    queryFn: () => dashboardService.getPendingRequirements({ limit, dateRange })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Requisitos pendientes</CardTitle>
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

  if (isError || !Array.isArray(requirements) || requirements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Requisitos pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay requisitos pendientes</p>
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprobado</Badge>;
      case 'REJECTED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requisitos pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirements.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">
                    {item.personName}
                  </h4>
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {item.requirement}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 