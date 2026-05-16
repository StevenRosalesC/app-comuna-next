import React from 'react';
import { Paragraph } from '../ui/atoms/paragraph';
import {
  Globe,
  ListCheck,
  MessageCircleWarning,
  Newspaper,
  NotebookPen,
  StickyNote
} from 'lucide-react';
import { getRelativeTime } from '@/utils/date';
import Image from 'next/image';
import { NoticeType } from 'types/notices';
import { Link } from 'next-view-transitions';
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';

interface Props {
  createdAt: string;
  title: string;
  slug?: string;
  description: string;
  createdBy: string;
  newsId: string;
  type: string;
  coverImageUrl?: string;
}

export const NoticeMiniCard = ({
  createdAt,
  title,
  slug,
  description,
  createdBy,
  newsId,
  type,
  coverImageUrl
}: Props) => {
  const relativeTime = getRelativeTime(createdAt);
  const noticeSlug = slug;
  const cover = coverImageUrl || '/not-found.webp';
  const handleIcon = (type: string) => {
    switch (type) {
      case NoticeType.Noticia:
        return <Newspaper className='text-primary' />;
      case NoticeType.Evento:
        return <ListCheck className='text-primary' />;
      case NoticeType.Anuncio:
        return <MessageCircleWarning className='text-primary' />;
      case NoticeType.Blog:
        return <NotebookPen className='text-primary' />;
      case NoticeType.Aviso:
        return <Globe className='text-primary' />;
      default:
        return <StickyNote className='text-primary' />;
    }
  };
  return (
    <article className='mb-10 flex h-full flex-1 flex-col rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-ring dark:bg-background/40'>
      <div className='mb-5 flex items-center justify-between text-muted-foreground'>
        <span className='inline-flex items-center rounded bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
          {handleIcon(type)}
          <span className='ml-1'>{type}</span>
        </span>
        <span className='text-sm'>{relativeTime}</span>
      </div>
      <Image
        src={cover}
        alt={title ? `Imagen de la noticia: ${title}` : 'Imagen de noticia'}
        width={600}
        height={400}
        className='aspect-video rounded-lg object-cover'
        loading='lazy'
        unoptimized={isLocalImageUrl(cover)}
      />
      <h2 className='mb-2 line-clamp-2 text-2xl font-bold tracking-tight text-primary'>
        <Link
          rel='noopener noreferrer'
          href={`/notices/${noticeSlug}`}
          className={`hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            title.length > 30 ? 'text-md' : ''
          }`}
          aria-label={`Leer noticia: ${title}`}
        >
          {title}
        </Link>
      </h2>
      <Paragraph size={'md'} className='line-clamp-5'>
        {description}
      </Paragraph>
      <div className='mt-auto flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <span
            className='font-medium'
            aria-label={`Autor: ${createdBy}`}
          >
            {createdBy}
          </span>
        </div>
        <Link
          rel='noopener noreferrer'
          href={`/notices/${noticeSlug}`}
          className='inline-flex items-center font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          aria-label={`Leer más sobre: ${title}`}
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
