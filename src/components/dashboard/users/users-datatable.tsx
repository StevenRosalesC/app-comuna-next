'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { PersonsTablePagination } from '../persons/persons-table-pagination';
import { UsersTable } from './users-table';
import { usersService } from '@/services/users';
import { User } from '@/interfaces/users';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { ServiceResponse } from '@/interfaces/common';
import { IUsersRequestResponse } from '@/interfaces/users';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useDebounce } from './useDebounce';
import { UsersTableToolbar } from './users-table-toolbar';

export default function UsersDataTable() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showActive, setShowActive] = useState(true);

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

  const {
    data: users,
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
        showActive
      }
    ],
    queryFn: () =>
      usersService.getUsers(
        pageSize,
        pageIndex * pageSize,
        sorting.length ? sorting[0].id : 'username',
        sorting.length && sorting[0].desc ? 'desc' : 'asc',
        debouncedSearch,
        showActive
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
        page: '0'
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
      toast.loading('Actualizando usuario...');
      const { userId, ...userToUpdate } = user;
      const response = await usersService.updateUser(userId, userToUpdate);
      if (response.status) {
        toast.dismiss();
        toast.success(response.message);
        await refetch();
      } else {
        toast.dismiss();
        toast.error(response.message);
      }
    } catch (error) {
      toast.dismiss();
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
    return users?.data?.count ?? 0;
  }, [users?.data?.count]);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Usuarios</CardTitle>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>
            {showActive ? 'Activos' : 'Inactivos'}
          </span>
          <Switch
            checked={showActive}
            onCheckedChange={(checked) => setShowActive(checked)}
          />
          <Button
            variant='outline'
            size='sm'
            className='ml-2'
            title='Recargar'
            onClick={() => {
              refetch();
            }}
            disabled={isFetching}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Recargar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UsersTableToolbar search={search} onSearchChange={setSearch} />
        <UsersTable
          data={
            users?.data?.data.filter((u) =>
              showActive ? u.status : !u.status
            ) || []
          }
          isLoading={usersLoading}
          pageSize={pageSize}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          updateUser={handleEditUser}
        />
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            {totalCount} registros en total.
          </div>
          <PersonsTablePagination
            pageIndex={pageIndex}
            pageCount={Math.ceil(totalCount / pageSize)}
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
