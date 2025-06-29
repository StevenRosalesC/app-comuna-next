import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PersonsTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  isLoading: boolean;
  onPageIndexChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PersonsTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  isLoading,
  onPageIndexChange,
  onPageSizeChange
}: PersonsTablePaginationProps) {
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
            {[5, 10, 20, 30, 40, 50].map((size) => (
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
