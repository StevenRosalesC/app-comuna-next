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
        return <Newspaper className='text-green-600' />;
      case NoticeType.Evento:
        return <ListCheck className='text-green-600' />;
      case NoticeType.Anuncio:
        return <MessageCircleWarning className='text-green-600' />;
      case NoticeType.Blog:
        return <NotebookPen className='text-green-600' />;
      case NoticeType.Aviso:
        return <Globe className='text-green-600' />;
      default:
        return <StickyNote className='text-green-600' />;
    }
  };
  return (
    <article className='mb-10 flex h-full flex-1 flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md focus-within:ring-2 focus-within:ring-green-600'>
      <div className='mb-5 flex items-center justify-between text-gray-500'>
        <span className='bg-primary-100 text-primary-800 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium'>
          {handleIcon(type)}
          <span className='ml-1'>{type}</span>
        </span>
        <span className='text-sm'>{relativeTime}</span>
      </div>
      <Image
        src={coverImageUrl || '/not-found.webp'}
        alt={title ? `Imagen de la noticia: ${title}` : 'Imagen de noticia'}
        width={600}
        height={400}
        className='aspect-video rounded-lg object-cover'
        loading='lazy'
      />
      <h2 className='mb-2 line-clamp-2 text-2xl font-bold tracking-tight text-green-600'>
        <Link
          rel='noopener noreferrer'
          href={`/notices/${title}`}
          className={`hover:underline focus:outline-none focus:ring-2 focus:ring-green-600 ${
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
            className='font-medium dark:text-white'
            aria-label={`Autor: ${createdBy}`}
          >
            {createdBy}
          </span>
        </div>
        <Link
          rel='noopener noreferrer'
          href={`/notices/${title}`}
          className='inline-flex items-center font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-green-600'
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
      {/* Datos estructurados SEO tipo NewsArticle */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: title,
            image: [coverImageUrl],
            datePublished: createdAt,
            author: [{ '@type': 'Person', name: createdBy }],
            publisher: {
              '@type': 'Organization',
              name: 'Comuna Bambil Collao',
              logo: {
                '@type': 'ImageObject',
                url: `https://${process.env.NEXT_PUBLIC_APP_URL}/icon.webp`
              }
            },
            description: description
          })
        }}
      />
    </article>
  );
};
