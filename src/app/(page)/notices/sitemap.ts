import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getAllNews } from '@/services/page';
import type { MetadataRoute } from 'next';
import { Notice } from 'types/dashboard';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notices = await getAllNews(100, 0); 

  return [
    {
      url: `https://${NEXT_PUBLIC_APP_URL}/notices`,
      lastModified: new Date(),
    },
    ...notices.data.map((notice: Notice) => ({
      url: `https://${NEXT_PUBLIC_APP_URL}/notices/${notice.title}`,
    })),
  ];
}