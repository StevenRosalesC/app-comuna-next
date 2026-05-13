import { API_URL } from '@/lib/env.config';
import { Notice } from 'types/dashboard';

export const getNoticeBySlug = async (slug: string): Promise<Notice | null> => {
  try {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || API_URL;
    const normalized = rawApiUrl.endsWith('/')
      ? rawApiUrl.slice(0, -1)
      : rawApiUrl;
    const baseUrl = normalized.endsWith('/api')
      ? normalized
      : `${normalized}/api`;

    const response = await fetch(
      `${baseUrl}/news/slug/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        next: {
          revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60'),
          tags: ['news']
        }
      }
    );

    if (!response.ok) return null;
    const data: Notice = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
