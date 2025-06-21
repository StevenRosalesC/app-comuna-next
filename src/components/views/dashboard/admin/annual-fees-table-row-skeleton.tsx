import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export const AnnualFeesTableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell className='font-medium'>
        <Skeleton className='h-6 w-full' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-6 w-24' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-6 w-20' />
      </TableCell>
      <TableCell className='text-right'>
        <div className='flex justify-end gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </TableCell>
    </TableRow>
  );
};
