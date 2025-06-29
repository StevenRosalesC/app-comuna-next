import { Skeleton } from '@/components/ui/skeleton';

interface NoticeSkeletonProps {
  count?: number;
}
export default function NoticeSkeleton({ count = 1 }: NoticeSkeletonProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className='h-52 w-full rounded-lg' />
      ))}
    </div>
  );
}
