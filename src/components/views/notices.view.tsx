'use client';
import Image from 'next/image';
import { NoticeCard } from '../notices/notice-card';
import { useEffect, useState } from 'react';
import { Notice } from 'types/dashboard';
import { getRelativeTime } from '@/utils/date';
import { Button } from '../ui/button';
import { getAllNews } from '@/services/page';
import { Link } from 'next-view-transitions';
import { Loader2 } from 'lucide-react';
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'Comuna Bambil Collao',
  url: `https://${process.env.NEXT_PUBLIC_APP_URL}/notices`,
  logo: `https://${process.env.NEXT_PUBLIC_APP_URL}/icon.webp`,
  sameAs: [
    'https://www.facebook.com/comunabambilcollao',
    'https://www.instagram.com/comunabambilcollao',
    'https://www.youtube.com/@comunabambilcollao'
  ]
};

export default function NoticesView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);

  const handleLoadMore = () => {
    setPage(page + 1);
    getNotices();
  };

  const getNotices = async () => {
    setLoading(true);
    try {
      const { data, count } = await getAllNews(6, 6 * page);
      setNotices((prevNotices) => [...prevNotices, ...data]);
      setTotal(count);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (typeof window !== 'undefined') {
        const script = document.querySelector(
          'script[type="application/ld+json"]'
        );
        if (script) {
          document.head.removeChild(script);
        }
      }
    };
  }, []);

  return (
    <section className='text-foreground'>
      {notices.length < 1 && !loading ? (
        <div className='flex h-[100dvh] items-center justify-center'>
          <h2 className='text-2xl font-semibold'>
            No hay noticias disponibles
          </h2>
        </div>
      ) : (
        <div className='container mx-auto max-w-6xl space-y-6 p-6 sm:space-y-12'>
          <h2 className='text-center text-2xl font-bold  lg:text-4xl'>
            Noticias de la comuna Bambil Collao
          </h2>

          {notices.slice(0, 1).map((notice, index) => (
            <Link
              rel='noopener noreferrer'
              href={`/notices/${notice.slug || notice.title}`}
              key={index}
              className='group mx-auto block max-w-6xl gap-3 overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-sm backdrop-blur hover:no-underline focus:no-underline dark:bg-background/40 sm:max-w-full lg:grid lg:grid-cols-12'
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
                src={notice.coverImageUrl || '/not-found-1.webp'}
                className='h-96 w-full object-cover sm:h-96 lg:col-span-7'
                loading='lazy'
                unoptimized={isLocalImageUrl(notice.coverImageUrl)}
              />
              <div className='space-y-2 p-6 lg:col-span-5'>
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
                    {getRelativeTime(
                      notice.createdAt ?? new Date().toISOString()
                    )}
                  </span>
                </div>
                <h3 className='line-clamp-2 text-2xl font-semibold text-primary group-hover:underline group-focus:underline sm:text-4xl'>
                  {notice.title}
                </h3>
                <span className='sr-only'>
                  Publicado{' '}
                  {getRelativeTime(
                    notice.createdAt ?? new Date().toISOString()
                  )}{' '}
                  por {notice.createdBy}
                </span>
                <p className='line-clamp-6 text-muted-foreground'>
                  {notice.description}
                </p>
              </div>
            </Link>
          ))}

          <div className='grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {notices.length > 1 &&
              notices.slice(1).map((notice, index) => (
                <div className='h-full' key={index}>
                  <NoticeCard notice={notice} />
                </div>
              ))}
            <div className='col-span-full flex justify-center'>
              {notices.length < total && (
                <Button
                  type='button'
                  variant='outline'
                  className='flex items-center gap-2'
                  onClick={handleLoadMore}
                  aria-label='Cargar más noticias'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        className='mr-2 h-4 w-4 animate-spin'
                        aria-label='Cargando noticias'
                      />
                      Cargando...
                    </>
                  ) : (
                    'Ver más'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
