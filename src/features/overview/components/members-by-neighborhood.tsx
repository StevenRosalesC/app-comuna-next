'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type MembersByNeighborhood } from '@/services/dashboard';
import { MapPin, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

interface MembersByNeighborhoodProps {
  dateRange?: string;
}

export function MembersByNeighborhood({ dateRange }: MembersByNeighborhoodProps) {
  const { data, isLoading, isError } = useQuery<MembersByNeighborhood[]>({
    queryKey: ['dashboard-members-by-neighborhood', dateRange],
    queryFn: () =>
      dateRange
        ? dashboardService.getMembersByNeighborhood({ dateRange })
        : dashboardService.getMembersByNeighborhood(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Miembros por barrio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Miembros por barrio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: item.neighborhoodName,
    members: item.membersCount
  }));

  const totalMembers = data.reduce((sum, item) => sum + item.membersCount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Miembros por barrio</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Total: {totalMembers}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value} miembros`, 'Miembros']}
                labelFormatter={(label) => `Barrio: ${label}`}
              />
              <Bar
                dataKey="members"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">
                    {item.neighborhoodName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.membersCount} miembros
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 