'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MembersTablePagination } from './members-table-pagination';
import MembersTable from './members-table';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/services/members';
import { Member } from '@/interfaces/members';
import { useDebounce } from '../persons/useDebounce';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMembersTable } from './useMembersTable';
import { SortingState } from '@tanstack/react-table';
import { toast } from 'sonner';

export default function MembersDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for search, pagination, and sorting from URL
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);
  const [pageSize, setPageSize] = useState(
    () => Number(searchParams.get('size')) || 10
  );
  const [pageIndex, setPageIndex] = useState(() =>
    Math.max(Number(searchParams.get('page') || 1) - 1, 0)
  );
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortField = searchParams.get('sort');
    const sortDir = searchParams.get('dir');
    return sortField && sortDir
      ? [{ id: sortField, desc: sortDir === 'desc' }]
      : [];
  });

  const isInitialMount = useRef(true);

  // Fetch members data
  const { data, isLoading, refetch, isFetching } = useQuery<
    { data: Member[]; count: number },
    Error
  >({
    queryKey: [
      'members',
      { pageSize, pageIndex, search: debouncedSearch, sorting }
    ],
    queryFn: () =>
      getMembers(pageSize, pageIndex * pageSize, debouncedSearch, sorting)
  });

  // Calculate total count and page count
  const totalCount = useMemo(() => data?.count ?? 0, [data?.count]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

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

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
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

  // Map API data to table data
  const mappedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: any) => ({
      memberId: item.memberId,
      personId: item.personId,
      lastName: item.persons.lastName ?? '',
      firstName: item.persons.firstName ?? '',
      houseNumber: item.houseNumber ?? '',
      joinDate: item.createdAt ?? '',
      status: (item.status === true ? 'active' : 'inactive') as
        | 'active'
        | 'inactive'
    }));
  }, [data]);

  // Action handlers for table actions
  const handleEdit = (member: Member) => {
    // TODO: Implement edit action
    toast.success(`Editando comunero: ${member.lastName} ${member.firstName}`);
  };
  const handleView = (member: Member) => {
    // TODO: Implement view action
    toast.success(`Ver comunero: ${member.lastName} ${member.firstName}`);
  };
  const handleDelete = (member: Member) => {
    // TODO: Implement delete action
    toast.success(
      `Eliminando comunero: ${member.lastName} ${member.firstName}`
    );
  };

  // Table instance and columns
  const { table, columns } = useMembersTable({
    data: mappedData,
    sorting,
    onSortingChange: handleSortingChange,
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Comuneros</CardTitle>
        <Button
          variant='outline'
          size='sm'
          className='ml-2'
          title='Reload'
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span className='ml-1'>Reload</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex w-full flex-row items-center justify-between gap-2'>
          <Input
            placeholder='Buscar comunero'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <MembersTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          pageSize={pageSize}
        />
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            {totalCount} total records.
          </div>
          <MembersTablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageIndexChange={handlePageIndexChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
