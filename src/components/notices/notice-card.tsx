import { getRelativeTime } from '@/utils/date';
import Image from 'next/image';
import Link from 'next/link';
import { Notice } from 'types/dashboard';

interface Props {
  notice: Notice;
}

export const NoticeCard = ({ notice }: Props) => {
  return (
    <Link
      rel='noopener noreferrer'
      href={`/notices/${notice.title}`}
      className='group mx-auto max-w-sm hover:no-underline focus:no-underline dark:bg-gray-50 sm:block'
    >
      <Image
        width={800}
        height={600}
        alt=''
        role='presentation'
        className='h-44 w-full rounded object-cover dark:bg-gray-500'
        src={notice.coverImageUrl || '/not-found-1.webp'}
      />
      <div className='space-y-2 p-6'>
        <h3 className='text-2xl font-semibold group-hover:underline group-focus:underline'>
          {notice.title}
        </h3>
        <span className='text-xs dark:text-gray-600'>
          {getRelativeTime(notice.createdAt ?? new Date().toISOString())}
        </span>
        <p>{notice.description}</p>
      </div>
    </Link>
  );
};
