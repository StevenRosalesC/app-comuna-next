import { getRelativeTime } from '@/utils/date';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { Notice } from 'types/dashboard';
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';

interface Props {
  notice: Notice;
}

export const NoticeCard = ({ notice }: Props) => {
  const noticeSlug = notice.slug || notice.title;
  const cover = notice.coverImageUrl || '/not-found-1.webp';
  return (
    <Link
      rel='noopener noreferrer'
      href={`/notices/${noticeSlug}`}
      className='group mx-auto block max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-sm backdrop-blur hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-background/40 sm:block'
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
        className='h-44 w-full object-cover'
        src={cover}
        loading='lazy'
        unoptimized={isLocalImageUrl(cover)}
      />
      <div className='space-y-2 p-6'>
        <div className='mb-2 flex items-center gap-2'>
          <span
            className='text-xs text-muted-foreground'
            aria-label={`Autor: ${notice.createdBy}`}
          >
            {notice.createdBy}
          </span>
          <span
            className='text-xs text-muted-foreground'
            aria-label={`Fecha de publicación: ${getRelativeTime(
              notice.createdAt ?? new Date().toISOString()
            )}`}
          >
            {getRelativeTime(notice.createdAt ?? new Date().toISOString())}
          </span>
        </div>
        <h3 className='line-clamp-2 text-2xl font-semibold text-primary group-hover:underline group-focus:underline'>
          {notice.title}
        </h3>
        <span className='sr-only'>
          Publicado{' '}
          {getRelativeTime(notice.createdAt ?? new Date().toISOString())} por{' '}
          {notice.createdBy}
        </span>
        <p className='line-clamp-6 text-muted-foreground'>
          {notice.description}
        </p>
      </div>
    </Link>
  );
};
