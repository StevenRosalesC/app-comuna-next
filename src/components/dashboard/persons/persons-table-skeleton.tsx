import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface PersonsTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function PersonsTableSkeleton({
  columns,
  rows = 10
}: PersonsTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className='h-9 w-full' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
