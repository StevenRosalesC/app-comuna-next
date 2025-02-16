'use client';
import Image from 'next/image';
import Link from 'next/link';
import { NoticeCard } from '../notices/notice-card';
import { useEffect, useState } from 'react';
import { Notice } from 'types/dashboard';
import { getAllNotices } from '@/services/notices';
import { getRelativeTime } from '@/utils/date';

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
      console.log({ notices });
      setNoticesToShow(notices.slice(0, noticesLimit));
    });
    setLoading(false);
  }, [noticesLimit]);
  return (
    <section className='dark:bg-gray-100 dark:text-gray-800'>
      <div className='container mx-auto max-w-6xl space-y-6 p-6 sm:space-y-12'>
        {notices.length > 0 &&
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
                src={notice.coverImageUrl || '/not-found.webp'}
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
          {notices.length > 0 &&
            noticesToShow
              .slice(1)
              .map((notice, index) => (
                <NoticeCard notice={notice} key={index} />
              ))}
        </div>
        <div className='flex justify-center'>
          <button
            type='button'
            className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-50 dark:text-gray-600'
            onClick={handleLoadMore}
          >
            Ver más
          </button>
        </div>
      </div>
    </section>
  );
}
