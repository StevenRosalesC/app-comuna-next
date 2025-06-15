'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Plus, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../persons/useDebounce';
import { getAllNotices } from '@/services/notices';
import { Notice } from 'types/dashboard';
import { Link } from 'next-view-transitions';
import { format } from 'date-fns';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface NoticesTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

function NoticesTableToolbar({
  search,
  onSearchChange
}: NoticesTableToolbarProps) {
  const { permissions } = usePermissionsStore();
  const canCreateNotice = permissions?.[ValidModules.NOTICES]?.includes(
    ValidActions.CREATE
  );
  return (
    <div className='mb-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-1 items-center gap-2'>
        <input
          type='text'
          placeholder='Buscar noticia'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className='input input-bordered w-full max-w-xs'
        />
      </div>
      {canCreateNotice && (
        <Button
          asChild
          variant='default'
          size='sm'
          className='whitespace-nowrap'
        >
          <Link
            href='/dashboard/notices/create'
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' /> Crear noticia
          </Link>
        </Button>
      )}
    </div>
  );
}

interface NoticesTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  isLoading: boolean;
  onPageIndexChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function NoticesTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  isLoading,
  onPageIndexChange,
  onPageSizeChange
}: NoticesTablePaginationProps) {
  return (
    <div className='mt-4 flex w-full flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 lg:space-x-8'>
      <div className='flex items-center space-x-2'>
        <p className='whitespace-nowrap text-sm font-medium'>
          Registros por página
        </p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[6, 12, 24, 48, 96].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center justify-center gap-2'>
        <div className='hidden items-center sm:flex'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageIndexChange(0)}
            disabled={pageIndex === 0 || isLoading}
            className='px-2'
          >
            {'<<'}
          </Button>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageIndexChange(pageIndex - 1)}
          disabled={pageIndex === 0 || isLoading}
        >
          Anterior
        </Button>
        <div className='flex min-w-[100px] items-center justify-center text-sm'>
          <span className='hidden sm:inline'>Página </span>
          {pageIndex + 1} de {pageCount}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageIndexChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1 || isLoading}
        >
          Siguiente
        </Button>
        <div className='hidden items-center sm:flex'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageIndexChange(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1 || isLoading}
            className='px-2'
          >
            {'>>'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NoticesDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);
  const [pageSize, setPageSize] = useState(
    () => Number(searchParams.get('size')) || 6
  );
  const [pageIndex, setPageIndex] = useState(() =>
    Math.max(Number(searchParams.get('page') || 1) - 1, 0)
  );

  const { data, isLoading, error, refetch, isFetching } = useQuery<
    { data: Notice[]; count: number },
    Error
  >({
    queryKey: ['notices', { pageSize, pageIndex, search: debouncedSearch }],
    queryFn: async () => {
      const { data, count } = await getAllNotices(
        pageSize,
        pageSize * pageIndex
      );
      return { data, count };
    }
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
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateUrl({ search: debouncedSearch || null, page: '1' });
    setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (error) toast.error('Error al obtener las noticias');
  }, [error]);

  const totalCount = useMemo(() => data?.count ?? 0, [data?.count]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  return (
    <Card className='border border-gray-200 shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-bold'>Noticias</CardTitle>
        <Button
          variant='outline'
          size='sm'
          className='ml-2'
          title='Recargar'
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span className='ml-1'>Recargar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <NoticesTableToolbar search={search} onSearchChange={setSearch} />
        <div className='overflow-x-auto rounded-lg border border-gray-100 bg-white'>
          <table className='table w-full'>
            <thead>
              <tr className='bg-muted/50'>
                <th className='px-4 py-2 text-left font-semibold'>Título</th>
                <th className='max-w-xs px-4 py-2 text-left font-semibold'>
                  Descripción
                </th>
                <th className='px-4 py-2 text-center font-semibold'>Fecha</th>
                <th className='px-4 py-2 text-center font-semibold'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className='py-6 text-center'>
                    Cargando...
                  </td>
                </tr>
              ) : data && data.data.length > 0 ? (
                data.data.map((notice) => (
                  <tr
                    key={notice.newsId}
                    className='transition-colors hover:bg-muted/30'
                  >
                    <td className='px-4 py-2 align-middle font-medium'>
                      {notice.title}
                    </td>
                    <td className='max-w-xs truncate px-4 py-2 align-middle'>
                      <span className='line-clamp-2 block'>
                        {notice.description}
                      </span>
                    </td>
                    <td className='px-4 py-2 text-center align-middle'>
                      {notice.createdAt
                        ? format(new Date(notice.createdAt), 'dd/MM/yyyy')
                        : ''}
                    </td>
                    <td className='px-4 py-2 text-center align-middle'>
                      <Button
                        asChild
                        variant='ghost'
                        size='icon'
                        title='Ver detalle'
                      >
                        <Link
                          href={`/dashboard/notices/${notice.newsId}/preview`}
                        >
                          <Eye className='h-4 w-4' />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className='py-6 text-center text-muted-foreground'
                  >
                    No hay noticias disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='mt-4'>
          <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
            {totalCount} registros en total.
          </div>
          <NoticesTablePagination
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
