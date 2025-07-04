'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, type LatestNews } from '@/services/dashboard';
import { Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

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
        <CardHeader>
          <CardTitle>Últimas noticias</CardTitle>
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
        <CardHeader>
          <CardTitle>Últimas noticias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay noticias disponibles</p>
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
      <CardHeader>
        <CardTitle>Últimas noticias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.newsId} className="flex items-start space-x-4">
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
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                  {item.published && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Publicada
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 