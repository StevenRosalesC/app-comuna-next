'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, type LatestNews } from '@/services/dashboard';
import { Calendar, ExternalLink, FileText, Plus } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface LatestNewsProps {
  limit?: number;
  dateRange?: string;
}

export function LatestNews({ limit = 5, dateRange }: LatestNewsProps) {
  const { data: news, isLoading, isError } = useQuery<LatestNews[]>({
    queryKey: ['dashboard-latest-news', limit, dateRange],
    queryFn: () => dashboardService.getLatestNews({ limit, dateRange })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>Últimas noticias</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/notices">Ver todas</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !Array.isArray(news) || news.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>Últimas noticias</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/notices">Ver todas</Link>
          </Button>
        </CardHeader>
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No hay noticias aún</p>
            <p className="text-xs text-muted-foreground">
              Publica una noticia para mantener informada a la comunidad.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <Button asChild size="sm" className="gap-2">
                <Link href="/dashboard/notices/create">
                  <Plus className="h-4 w-4" />
                  Crear noticia
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/notices">Ver todas</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Últimas noticias</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/notices">Ver todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <Link
              key={item.newsId}
              href={`/dashboard/notices/${item.newsId}/preview`}
              className="group flex items-start gap-4 rounded-lg p-2 -m-2 transition-colors hover:bg-muted/50"
              aria-label={`Ver noticia: ${item.title}`}
            >
              <div className="relative h-16 w-16 flex-shrink-0">
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-tight line-clamp-2">
                  {item.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  {item.published && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Publicada
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-colors group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
