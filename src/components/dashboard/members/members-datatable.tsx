'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { MembersTableToolbar } from './members-table-toolbar';
import { MembersTablePagination } from './members-table-pagination';
import MembersTable from './members-table';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/services/members';
import { Member } from '@/interfaces/members';
import { useDebounce } from '../persons/useDebounce';

export default function MembersDataTable() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading, error, refetch, isFetching } = useQuery<
    { data: Member[]; count: number },
    Error
  >({
    queryKey: ['members', { pageSize, pageIndex, search: debouncedSearch }],
    queryFn: () => getMembers(pageSize, pageIndex * pageSize, debouncedSearch)
  });

  const totalCount = useMemo(() => data?.count ?? 0, [data?.count]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

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
      status: item.status ? 'active' : 'inactive',
      documents: item.documents ?? 0,
      annualFeePaid: item.annualFeePaid ?? false
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle>Comuneros</CardTitle>
      </CardHeader>
      <CardContent>
        <MembersTable
          data={mappedData}
          sorting={[]}
          onSortingChange={() => {}}
          isLoading={isLoading}
        />
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            {totalCount} registros en total.
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
