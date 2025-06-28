import { getRelativeTime } from '@/utils/date';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { Notice } from 'types/dashboard';

interface Props {
  notice: Notice;
}

export const NoticeCard = ({ notice }: Props) => {
  return (
    <Link
      rel='noopener noreferrer'
      href={`/notices/${notice.title}`}
      className='group mx-auto max-w-sm hover:no-underline focus:no-underline focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-gray-50 sm:block'
      aria-label={`Leer noticia: ${notice.title}`}
    >
      <Image
        width={800}
        height={600}
        alt={
          notice.title
            ? `Imagen de la noticia: ${notice.title}`
            : 'Imagen de noticia'
        }
        className='h-44 w-full rounded object-cover dark:bg-gray-500'
        src={notice.coverImageUrl || '/not-found-1.webp'}
        loading='lazy'
      />
      <div className='space-y-2 p-6'>
        <div className='mb-2 flex items-center gap-2'>
          <span
            className='text-xs text-gray-500'
            aria-label={`Autor: ${notice.createdBy}`}
          >
            {notice.createdBy}
          </span>
          <span
            className='text-xs text-gray-500'
            aria-label={`Fecha de publicación: ${getRelativeTime(
              notice.createdAt ?? new Date().toISOString()
            )}`}
          >
            {getRelativeTime(notice.createdAt ?? new Date().toISOString())}
          </span>
        </div>
        <h3 className='line-clamp-2 text-2xl font-semibold text-green-600 group-hover:underline group-focus:underline'>
          {notice.title}
        </h3>
        <span className='sr-only'>
          Publicado{' '}
          {getRelativeTime(notice.createdAt ?? new Date().toISOString())} por{' '}
          {notice.createdBy}
        </span>
        <p className='line-clamp-6'>{notice.description}</p>
        {/* Datos estructurados SEO tipo NewsArticle */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: notice.title,
              image: [notice.coverImageUrl],
              datePublished: notice.createdAt,
              dateModified: notice.updatedAt,
              author: [{ '@type': 'Person', name: notice.createdBy }],
              publisher: {
                '@type': 'Organization',
                name: 'Comuna Bambil Collao',
                logo: {
                  '@type': 'ImageObject',
                  url: `https://${process.env.NEXT_PUBLIC_APP_URL}/icon.webp`
                }
              },
              description: notice.description
            })
          }}
        />
      </div>
    </Link>
  );
};
