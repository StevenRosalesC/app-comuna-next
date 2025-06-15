'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
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
  // State for search, pagination, and sorting
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch members data
  const { data, isLoading, refetch, isFetching } = useQuery<
    { data: Member[]; count: number },
    Error
  >({
    queryKey: [
      'members',
      { pageSize, pageIndex, search: debouncedSearch, sorting }
    ],
    queryFn: () => getMembers(pageSize, pageIndex * pageSize, debouncedSearch)
  });

  // Calculate total count and page count
  const totalCount = useMemo(() => data?.count ?? 0, [data?.count]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  // Map API data to table data
  const mappedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: any) => ({
      memberId: item.memberId,
      personId: item.personId,
      fullName: item.persons
        ? `${item.persons.firstName ?? ''} ${
            item.persons.lastName ?? ''
          }`.trim()
        : '',
      houseNumber: item.houseNumber ?? '',
      joinDate: item.createdAt ?? '',
      status: (item.status === true ? 'active' : 'inactive') as
        | 'active'
        | 'inactive',
      documents: item.documents ?? 0,
      annualFeePaid: item.annualFeePaid ?? false
    }));
  }, [data]);

  // Action handlers for table actions
  const handleEdit = (member: Member) => {
    // TODO: Implement edit action
    toast.success(`Editando comunero: ${member.fullName}`);
  };
  const handleView = (member: Member) => {
    // TODO: Implement view action
    toast.success(`Ver comunero: ${member.fullName}`);
  };
  const handleDelete = (member: Member) => {
    // TODO: Implement delete action
    toast.success(`Eliminando comunero: ${member.fullName}`);
  };

  // Table instance and columns
  const { table, columns } = useMembersTable({
    data: mappedData,
    sorting,
    onSortingChange: setSorting,
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
            onPageIndexChange={setPageIndex}
            onPageSizeChange={setPageSize}
          />
        </div>
      </CardContent>
    </Card>
  );
}
