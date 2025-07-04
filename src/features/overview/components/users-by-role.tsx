'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type UsersByRole } from '@/services/dashboard';
import { Shield, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';

interface UsersByRoleProps {
  dateRange?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function UsersByRole({ dateRange }: UsersByRoleProps) {
  const { data, isLoading, isError } = useQuery<UsersByRole[]>({
    queryKey: ['dashboard-users-by-role', dateRange],
    queryFn: () =>
      dateRange
        ? dashboardService.getUsersByRole({ dateRange })
        : dashboardService.getUsersByRole(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuarios por rol</CardTitle>
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
          <CardTitle>Usuarios por rol</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.roleName,
    value: item.usersCount,
    color: COLORS[index % COLORS.length]
  }));

  const totalUsers = data.reduce((sum, item) => sum + item.usersCount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalUsers) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} usuarios ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usuarios por rol</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Total: {totalUsers}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 gap-3 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                  >
                    <Shield
                      className="h-4 w-4"
                      style={{ color: COLORS[index % COLORS.length] }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {item.roleName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {((item.usersCount / totalUsers) * 100).toFixed(1)}% del total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {item.usersCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    usuarios
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 