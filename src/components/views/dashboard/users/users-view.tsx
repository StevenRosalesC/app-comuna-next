'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { CreateUserDialog } from '@/components/dashboard/users/create-user-dialog';
import UsersDataTable from '@/components/dashboard/users/users-datatable';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import { rolesService } from '@/services/roles';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Plus
} from 'lucide-react';

export default function UsersView() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { permissions } = usePermissionsStore();

  const canCreateUser = permissions?.[ValidModules.USERS]?.includes(
    ValidActions.CREATE
  );

  // Quick stats queries
  const { data: totalUsersData, isLoading: totalLoading } = useQuery({
    queryKey: ['users-stats', 'total'],
    queryFn: () => usersService.getUsers(1, 0)
  });

  const { data: activeUsersData, isLoading: activeLoading } = useQuery({
    queryKey: ['users-stats', 'active'],
    queryFn: () => usersService.getUsers(1, 0, undefined, undefined, undefined, true)
  });

  const { data: inactiveUsersData, isLoading: inactiveLoading } = useQuery({
    queryKey: ['users-stats', 'inactive'],
    queryFn: () => usersService.getUsers(1, 0, undefined, undefined, undefined, false)
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const totalCount = totalUsersData?.data?.count ?? 0;
  const activeCount = activeUsersData?.data?.count ?? 0;
  const inactiveCount = inactiveUsersData?.data?.count ?? 0;
  const rolesCount = Array.isArray(rolesData) ? rolesData.length : 0;

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Header with Title and Create Button */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Gestión de Usuarios'
            description='Administración de cuentas de acceso, asignación de roles y estados de actividad de usuarios en la plataforma.'
          />
          {canCreateUser && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className='shrink-0'
            >
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Usuario
            </Button>
          )}
        </div>
        <Separator />

        {/* KPI Metric Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total Users */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Total Usuarios</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {totalLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{totalCount}</div>
              )}
              <CardDescription className='text-xs'>
                Cuentas registradas
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2: Active Users */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Usuarios Activos</CardTitle>
              <UserCheck className='h-4 w-4 text-emerald-500' />
            </CardHeader>
            <CardContent>
              {activeLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                  {activeCount}
                </div>
              )}
              <CardDescription className='text-xs'>
                Con acceso habilitado
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3: Inactive Users */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Usuarios Inactivos</CardTitle>
              <UserX className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {inactiveLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold text-muted-foreground'>
                  {inactiveCount}
                </div>
              )}
              <CardDescription className='text-xs'>
                Acceso suspendido o deshabilitado
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 4: Roles */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Roles Disponibles</CardTitle>
              <Shield className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{rolesCount}</div>
              )}
              <CardDescription className='text-xs'>
                Niveles de permisos configurados
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <div className='w-full'>
          <UsersDataTable />
        </div>
      </div>

      {/* Create User Modal Dialog */}
      {canCreateUser && (
        <CreateUserDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      )}
    </PageContainer>
  );
}
