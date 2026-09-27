'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { UsersTable } from './users-table';
import { usersService } from '@/services/users';
import { User, IUsersRequestResponse } from '@/interfaces/users';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ServiceResponse } from '@/interfaces/common';
import { useDebounce } from './useDebounce';
import { UsersTableToolbar } from './users-table-toolbar';
import { Users as UsersIcon } from 'lucide-react';

export default function UsersDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [sorting, setSorting] = useState(() => {
    const sortField = searchParams.get('sort');
    const sortDir = searchParams.get('dir');
    return sortField && sortDir
      ? [{ id: sortField, desc: sortDir === 'desc' }]
      : [];
  });

  const [pageSize, setPageSize] = useState(
    () => Number(searchParams.get('size')) || 10
  );

  const [pageIndex, setPageIndex] = useState(() =>
    Math.max(Number(searchParams.get('page') || 1) - 1, 0)
  );

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);

  const statusParam = useMemo(() => {
    if (statusFilter === 'active') return true;
    if (statusFilter === 'inactive') return false;
    return undefined;
  }, [statusFilter]);

  const {
    data: usersResponse,
    isLoading: usersLoading,
    error,
    refetch,
    isFetching
  } = useQuery<ServiceResponse<IUsersRequestResponse | null>, Error>({
    queryKey: [
      'users',
      {
        pageSize,
        pageIndex,
        sorting,
        search: debouncedSearch,
        statusFilter
      }
    ],
    queryFn: () =>
      usersService.getUsers(
        pageSize,
        pageIndex * pageSize,
        sorting.length ? sorting[0].id : 'username',
        sorting.length && sorting[0].desc ? 'desc' : 'asc',
        debouncedSearch,
        statusParam
      )
  });

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false
      });
    },
    [pathname, router, searchParams]
  );

  const handleSortingChange = useCallback(
    (newSorting: import('@tanstack/react-table').SortingState) => {
      setSorting(newSorting);
      if (newSorting.length > 0) {
        updateUrl({
          sort: newSorting[0].id,
          dir: newSorting[0].desc ? 'desc' : 'asc'
        });
      } else {
        updateUrl({ sort: null, dir: null });
      }
    },
    [updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      setPageIndex(0);
      updateUrl({
        size: newSize.toString(),
        page: '1'
      });
    },
    [updateUrl]
  );

  const handlePageIndexChange = useCallback(
    (newIndex: number) => {
      setPageIndex(newIndex);
      updateUrl({ page: (newIndex + 1).toString() });
    },
    [updateUrl]
  );

  const handleEditUser = async (user: User) => {
    try {
      const { userId, ...userToUpdate } = user;
      const response = await usersService.updateUser(userId, userToUpdate);
      if (response.status) {
        toast.success(response.message || 'Usuario actualizado correctamente');
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['users-stats'] });
      } else {
        toast.error(response.message || 'Error al actualizar el usuario');
      }
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error('Error al obtener los usuarios');
    }
  }, [error]);

  useEffect(() => {
    updateUrl({
      search: debouncedSearch || null,
      page: '1'
    });
    setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const totalCount = useMemo(() => {
    return usersResponse?.data?.count ?? 0;
  }, [usersResponse?.data?.count]);

  const rawUsers = usersResponse?.data?.data || [];
  const pageCount = Math.max(Math.ceil(totalCount / pageSize), 1);

  return (
    <Card className='border shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-4 border-b space-y-0'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <UsersIcon className='h-5 w-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-lg font-semibold tracking-tight'>
                Directorio de Usuarios
              </CardTitle>
              <Badge variant='secondary' className='text-xs font-semibold'>
                {totalCount} {totalCount === 1 ? 'usuario' : 'usuarios'}
              </Badge>
            </div>
            <CardDescription className='text-xs text-muted-foreground'>
              Lista de cuentas con acceso activo o inactivo al sistema.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-5'>
        <UsersTableToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        <UsersTable
          data={rawUsers}
          isLoading={usersLoading}
          pageSize={pageSize}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          updateUser={handleEditUser}
        />

        <div className='mt-5 pt-4 border-t'>
          <DataTablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            isLoading={usersLoading}
            onPageIndexChange={handlePageIndexChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
