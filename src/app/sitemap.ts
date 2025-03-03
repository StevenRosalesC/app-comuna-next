import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${NEXT_PUBLIC_APP_URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `https://${NEXT_PUBLIC_APP_URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `https://${NEXT_PUBLIC_APP_URL}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `https://${NEXT_PUBLIC_APP_URL}/notices`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    }
  ];
}
