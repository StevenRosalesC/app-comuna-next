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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Skeleton component for better loading experience
function MembersDataTableSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Comuneros</CardTitle>
        <Skeleton className='h-8 w-20' />
      </CardHeader>
      <CardContent>
        {/* Search Input Skeleton */}
        <div className='mb-4 flex w-full flex-row items-center justify-between gap-2'>
          <Skeleton className='h-10 w-80' />
        </div>

        {/* Table Skeleton */}
        <div className='overflow-x-auto rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-24' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-24' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-16' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
                <TableRow key={row}>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-28' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                  <TableCell><Skeleton className='h-6 w-16 rounded-full' /></TableCell>
                  <TableCell>
                    <div className='flex gap-1'>
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info Skeleton */}
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            <Skeleton className='h-4 w-32' />
          </div>

          {/* Pagination Controls Skeleton */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
              <Skeleton className='h-8 w-8' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-8 w-20' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
      lastName: item.person.lastName ?? '',
      firstName: item.person.firstName ?? '',
      houseNumber: item.houseNumber ?? '',
      joinDate: item.createdAt ?? '',
      status: (item.status === true ? 'active' : 'inactive') as
        | 'active'
        | 'inactive'
    }));
  }, [data]);

  // Action handlers for table actions
  const handleEdit = (member: any) => {
    router.push(`/dashboard/members/${member.memberId}/edit`);
  };
  const handleView = (member: any) => {
    router.push(`/dashboard/members/${member.memberId}`);
  };
  const handleDelete = (member: any) => {
    // TODO: Implement delete action
    toast.success(
      `Eliminando comunero: ${member.lastName} ${member.firstName}`
    );
  };

  // Table instance and columns
  const { table, columns } = useMembersTable({
    data: mappedData as any,
    sorting,
    onSortingChange: handleSortingChange,
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete
  });

  if (isLoading) {
    return <MembersDataTableSkeleton />;
  }

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
