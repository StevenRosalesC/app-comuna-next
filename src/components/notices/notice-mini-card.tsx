import React from 'react';
import { Paragraph } from '../ui/atoms/paragraph';
import { Globe, ListCheck, MessageCircleWarning, Newspaper, NotebookPen, StickyNote } from 'lucide-react';
import { getRelativeTime } from '@/utils/date';
import Image from 'next/image';
import { NoticeType } from 'types/notices';
import { Link } from 'next-view-transitions';

interface Props {
  createdAt: string;
  title: string;
  description: string;
  createdBy: string;
  newsId: string;
  type: string;
  coverImageUrl?: string;
}

export const NoticeMiniCard = ({
  createdAt,
  title,
  description,
  createdBy,
  newsId,
  type,
  coverImageUrl
}: Props) => {
  const relativeTime = getRelativeTime(createdAt);
  const handleIcon = (type: string) => {
    switch (type) {
      case NoticeType.Noticia:
        return <Newspaper />;
      case NoticeType.Evento:
        return <ListCheck />;
      case NoticeType.Anuncio:
        return <MessageCircleWarning />;
      case NoticeType.Blog:
        return <NotebookPen />;
      case NoticeType.Aviso:
        return <Globe />;
      default:
        return <StickyNote />;
    }
  }
  return (
    <article className='mb-10 flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 h-full'>
      <div className='mb-5 flex items-center justify-between text-gray-500'>
        <span className='bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium'>
          {handleIcon(type)}
          <span className='ml-1'>
            {type}
          </span>
        </span>
        <span className='text-sm'>{relativeTime}</span>
      </div>
      <Image
        src={coverImageUrl || '/not-found.webp'}
        alt='Notice'
        width={600}
        height={400}
        className='aspect-video rounded-lg object-cover'
      />
      <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        <Link href={`/notices/${title}`} className={`hover:underline ${title.length > 30 ? 'text-md' : ''}`}>
          {title}
        </Link>
      </h2>
      <Paragraph size={
        description.length > 100 ? 'xs' : 'md'
      }>{description}</Paragraph>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <span className='font-medium dark:text-white'>{
            createdBy
          }</span>
        </div>
        <Link
          href={`/notices/${title}`}
          className='text-primary-600 dark:text-primary-500 inline-flex items-center font-medium hover:underline'
        >
          Leer más
          <svg
            className='ml-2 h-4 w-4'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
        </Link>
      </div>
    </article>
  );
};
