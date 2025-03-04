'use client';
import Image from 'next/image';
import { NoticeCard } from '../notices/notice-card';
import { useEffect, useState } from 'react';
import { Notice } from 'types/dashboard';
import { getRelativeTime } from '@/utils/date';
import { Button } from '../ui/button';
import { getAllNews } from '@/services/page';
import { Link } from 'next-view-transitions';
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getNotices();
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
    <section className='dark:bg-gray-100 dark:text-gray-800'>
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
              href={`/notices/${notice.title}`}
              key={index}
              className='group mx-auto block max-w-6xl gap-3 hover:no-underline focus:no-underline dark:bg-gray-50 sm:max-w-full lg:grid lg:grid-cols-12'
            >
              <Image
                width={800}
                height={600}
                alt=''
                src={notice.coverImageUrl || '/not-found-1.webp'}
                className='h-96 w-full rounded object-cover dark:bg-gray-500 sm:h-96 lg:col-span-7'
              />
              <div className='space-y-2 p-6 lg:col-span-5'>
                <h3 className='line-clamp-2 text-2xl font-semibold text-green-600 group-hover:underline group-focus:underline sm:text-4xl '>
                  {notice.title}
                </h3>
                <span className='text-xs'>
                  {getRelativeTime(
                    notice.createdAt ?? new Date().toISOString()
                  )}
                </span>
                <p className='line-clamp-6'>{notice.description}</p>
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
                  className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-50 dark:text-gray-600'
                  onClick={handleLoadMore}
                >
                  Ver más
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
