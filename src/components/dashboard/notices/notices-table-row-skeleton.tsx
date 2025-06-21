import { Skeleton } from '@/components/ui/skeleton';

export const NoticesTableRowSkeleton = () => {
  return (
    <tr className='w-full'>
      <td className='max-w-[100] truncate px-4 py-2 align-middle font-medium'>
        <Skeleton className='h-6 w-full' />
      </td>
      <td className='max-w-[100] truncate px-4 py-2 align-middle'>
        <Skeleton className='h-6 w-full' />
      </td>
      <td className='px-4 py-2 text-center align-middle'>
        <Skeleton className='mx-auto h-6 w-24' />
      </td>
      <td className='px-4 py-2 text-center align-middle'>
        <div className='flex items-center justify-center'>
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
      </td>
    </tr>
  );
};
