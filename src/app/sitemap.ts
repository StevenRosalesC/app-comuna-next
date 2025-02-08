import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${NEXT_PUBLIC_APP_URL}/`,
    },
    {
      url: `${NEXT_PUBLIC_APP_URL}/about`,
    },
    {
      url: `${NEXT_PUBLIC_APP_URL}/contact`,
    },
    {
      url: `${NEXT_PUBLIC_APP_URL}/notices`,
    }
  ];
}
