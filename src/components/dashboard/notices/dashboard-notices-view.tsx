'use client';

import { Card } from '@/components/ui/card';
import { getAllNotices } from '@/services/notices';
import { getRelativeTime } from '@/utils/date';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Notice } from 'types/dashboard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import NoticeSkeleton from './notice-skeleton';
export default function DashboardNoticesView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const getNotices = async () => {
    setLoading(true);
    const { data, count } = await getAllNotices(limit, limit * page - limit);
    setNotices(data);
    setTotal(count);
    setLoading(false);
  };

  useEffect(() => {
    getNotices();
  }, [page, limit]);

  return (
    <section>
      <div className='flex w-full flex-row justify-between'>
        <h3 className='text-2xl font-bold'>Noticias</h3>
        <Link href='/dashboard/notices/create' className='text-blue-500'>
          Crear noticia
        </Link>
      </div>
      {notices.length > 0 &&
        notices.map((notice) => (
          <Link
            key={notice.newsId}
            href={`/dashboard/notices/${notice.newsId}`}
          >
            <Card className=' mt-4 rounded-lg p-6 shadow-md'>
              <h4 className='text-lg font-bold hover:underline'>
                {notice.title}
              </h4>
              <p className=''>{notice.description}</p>
              <p className='text-sm'>
                {getRelativeTime(notice.createdAt ?? '')}
              </p>
            </Card>
          </Link>
        ))}
      {total > limit && (
        <div className='flex justify-center'>
          <Pagination>
            <PaginationPrevious>Previous</PaginationPrevious>
            <PaginationContent>
              {Array.from({ length: Math.ceil(total / 6) }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink href='#'>{index + 1}</PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext>Next</PaginationNext>
          </Pagination>
        </div>
      )}
    </section>
  );
}
