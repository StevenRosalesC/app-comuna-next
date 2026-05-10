'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PersonsTableToolbar } from './persons-table-toolbar';
import { PersonsTablePagination } from './persons-table-pagination';
import { PersonsTable } from './persons-table';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { ServiceResponse } from '@/interfaces/common';
import { IPersonsRequestResponse } from '@/interfaces/persons';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useDebounce } from './useDebounce';

export default function PersonsDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showActive, setShowActive] = useState(true);
  const isInitialMount = useRef(true);

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
    data: persons,
    isLoading: personsLoading,
    error,
    refetch,
    isFetching
  } = useQuery<ServiceResponse<IPersonsRequestResponse | null>, Error>({
    queryKey: [
      'persons',
      {
        pageSize,
        pageIndex,
        sorting,
        search: debouncedSearch,
        showActive
      }
    ],
    queryFn: () =>
      personsService.getPersons(
        pageSize,
        pageIndex * pageSize,
        sorting.length ? sorting[0].id : 'lastName',
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
      const nextUrl = `${pathname}?${params.toString()}`;
      const currentUrl = `${pathname}?${searchParams.toString()}`;

      if (nextUrl === currentUrl) {
        return;
      }

      router.replace(nextUrl, {
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

  const handleEditPerson = async (person: Person) => {
    try {
      toast.loading('Actualizando persona...');
      const { personId, ...personToUpdate } = person;
      const response = await personsService.updatePerson(
        personId,
        personToUpdate
      );
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
      toast.error('Error al actualizar la persona');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error('Error al obtener las personas');
    }
  }, [error]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    updateUrl({
      search: debouncedSearch || null,
      page: '1'
    });
    setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const totalCount = useMemo(() => {
    return persons?.data?.count ?? 0;
  }, [persons?.data?.count]);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Personas</CardTitle>
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
        <PersonsTableToolbar search={search} onSearchChange={setSearch} />
        <PersonsTable
          data={
            persons?.data?.data.filter((p) =>
              showActive ? p.status : !p.status
            ) || []
          }
          isLoading={personsLoading}
          pageSize={pageSize}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          updatePerson={handleEditPerson}
        />
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            {totalCount} registros en total.
          </div>
          <PersonsTablePagination
            pageIndex={pageIndex}
            pageCount={Math.ceil(totalCount / pageSize)}
            pageSize={pageSize}
            isLoading={personsLoading}
            onPageIndexChange={handlePageIndexChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
