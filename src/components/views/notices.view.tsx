'use client';
import Image from 'next/image';
import Link from 'next/link';
import { NoticeCard } from '../notices/notice-card';
import { useEffect, useState } from 'react';
import { Notice } from 'types/dashboard';
import { getAllNotices } from '@/services/notices';
import { getRelativeTime } from '@/utils/date';
import LoadingPage from '@/app/(page)/loading';

export default function NoticesView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticesLimit, setNoticesLimit] = useState(6);
  const [noticesToShow, setNoticesToShow] = useState(
    notices.slice(0, noticesLimit)
  );

  const handleLoadMore = () => {
    setNoticesLimit(noticesLimit + 6);
    setNoticesToShow(notices.slice(0, noticesLimit));
  };

  useEffect(() => {
    setLoading(true);
    getAllNotices().then((notices) => {
      setNotices(notices);
      setNoticesToShow(notices.slice(0, noticesLimit));
    });
    setLoading(false);
  }, [noticesLimit]);
  if (loading) return (
    <LoadingPage />
  );
  return (
    <section className='dark:bg-gray-100 dark:text-gray-800'>
      {
        notices.length < 1 ? (
          <div className='flex items-center justify-center h-[100dvh]'>
            <h2 className='text-2xl font-semibold'>No hay noticias disponibles</h2>
          </div>
        ) : (
          <div className='container mx-auto max-w-6xl space-y-6 p-6 sm:space-y-12'>
            {
              noticesToShow.slice(0, 1).map((notice, index) => (
                <Link
                  rel='noopener noreferrer'
                  href={`/notices/${notice.newsId}`}
                  key={index}
                  className='group mx-auto block max-w-6xl gap-3 hover:no-underline focus:no-underline dark:bg-gray-50 sm:max-w-full lg:grid lg:grid-cols-12'
                >
                  <Image
                    width={1920}
                    height={1080}
                    alt=''
                    src={notice.coverImageUrl || '/not-found-1.webp'}
                    className='h-96 w-full rounded object-cover dark:bg-gray-500 sm:h-96 lg:col-span-7'
                  />
                  <div className='space-y-2 p-6 lg:col-span-5'>
                    <h3 className='text-2xl font-semibold group-hover:underline group-focus:underline sm:text-4xl'>
                      {notice.title}
                    </h3>
                    <span className='text-xs dark:text-gray-600'>
                      {getRelativeTime(notice.createdAt ?? new Date().toISOString())}
                    </span>
                    <p>{notice.description}</p>
                  </div>
                </Link>
              ))}

            <div className='grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {notices.length > 1 &&
                noticesToShow
                  .slice(1)
                  .map((notice, index) => (
                    <NoticeCard notice={notice} key={index} />
                  ))
              }
              <div className=' col-span-full flex justify-center'>
                <button
                  type='button'
                  className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-50 dark:text-gray-600'
                  onClick={handleLoadMore}
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section>
  );
}
