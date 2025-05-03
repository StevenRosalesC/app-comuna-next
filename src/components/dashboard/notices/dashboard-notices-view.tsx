'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllNotices } from '@/services/notices';
import { getRelativeTime } from '@/utils/date';
import { useEffect, useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Plus, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { toast } from 'sonner';

export default function DashboardNoticesView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / limit);

  const getNotices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, count } = await getAllNotices(limit, limit * currentPage - limit);
      setNotices(data);
      setTotal(count);
    } catch (err) {
      toast.error('Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    getNotices();
  }, [getNotices]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h3 className='text-2xl font-bold tracking-tight'>Noticias</h3>
        <Button asChild>
          <Link href='/dashboard/notices/create' className='flex items-center gap-2'>
            <Plus className="h-4 w-4" />
            Crear noticia
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(limit).fill(0).map((_, index) => (
            <NoticeSkeleton key={index} />
          ))
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <Link
              key={notice.newsId}
              href={`/dashboard/notices/${notice.newsId}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card className='h-full hover:shadow-lg transition-shadow'>
                <CardHeader className="pb-3">
                  <CardTitle className='line-clamp-2 text-lg'>
                    {notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground line-clamp-3 mb-4'>
                    {notice.description}
                  </p>
                  <div className='flex justify-between items-center text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Clock className="h-4 w-4" />
                      {getRelativeTime(notice.createdAt ?? '')}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No hay noticias disponibles
          </div>
        )}
      </div>

      {total > limit && (
        <div className='flex justify-center mt-8'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>

              {currentPage > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && <PaginationEllipsis />}
                </>
              )}

              {renderPagination()}

              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <PaginationEllipsis />}
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
