import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export function DocumentTypesTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='h-4 w-[200px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[150px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[80px]' />
      </TableCell>
      <TableCell className='text-right'>
        <div className='flex justify-end gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </TableCell>
    </TableRow>
  );
}
