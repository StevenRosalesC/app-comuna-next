import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export const InvoiceHistoryTableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='h-5 w-20' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-24' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-16' />
      </TableCell>
      <TableCell className='text-right'>
        <Skeleton className='ml-auto h-8 w-24' />
      </TableCell>
    </TableRow>
  );
};
