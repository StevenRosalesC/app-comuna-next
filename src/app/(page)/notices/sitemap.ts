import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getAllNews } from '@/services/page';
import type { MetadataRoute } from 'next';
import { Notice } from 'types/dashboard';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_PUBLIC_APP_URL
    ? (NEXT_PUBLIC_APP_URL.startsWith('http')
        ? NEXT_PUBLIC_APP_URL
        : `https://${NEXT_PUBLIC_APP_URL}`)
    : '';

  try {
    const notices = await getAllNews(100, 0);
    const noticesList = Array.isArray(notices?.data) ? notices.data : [];

    return [
      {
        url: `${baseUrl}/notices`,
        lastModified: new Date()
      },
      ...noticesList.map((notice: Notice) => ({
        url: `${baseUrl}/notices/${encodeURIComponent(notice.slug || notice.title || '')}`,
        lastModified: notice.updatedAt ? new Date(notice.updatedAt) : new Date()
      }))
    ];
  } catch {
    return [
      {
        url: `${baseUrl}/notices`,
        lastModified: new Date()
      }
    ];
  }
}

