import { PageData } from 'types';
import { Notice } from 'types/dashboard';

const normalizeBaseUrl = (value?: string) => {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const rawApiUrl = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
);

const API_URL = rawApiUrl
  ? rawApiUrl.endsWith('/api')
    ? rawApiUrl
    : `${rawApiUrl}/api`
  : '';

export const getAllNews = async (
  limit: number,
  offset: number
): Promise<{ count: number; data: Notice[] }> => {
  try {
    if (!API_URL) return { count: 0, data: [] };
    const response = await fetch(
      `${API_URL}/news/published?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        next: {
          revalidate: parseInt(
            process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60'
          ),
          tags: ['get-all-news']
        }
      }
    );
    if (!response.ok) {
      return { count: 0, data: [] };
    }
    const data = await response.json();
    if (data && Array.isArray(data.data)) {
      return data;
    }
    if (Array.isArray(data)) {
      return { count: data.length, data };
    }
    return { count: 0, data: [] };
  } catch (error) {
    return { count: 0, data: [] };
  }
};

export const getNew = async (id: string): Promise<Notice | null> => {
  try {
    if (!API_URL) return null;
    const response = await fetch(`${API_URL}/news/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60'),
        tags: [`news`]
      }
    });
    if (!response.ok) return null;
    const data: Notice = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getPageInfo = async (): Promise<PageData> => {
  try {
    if (!API_URL) {
      return {
        totalPersons: 0,
        totalMembers: 0,
        totalNeighborhoods: 0,
        totalAssociations: 0,
        neighborhoodsImages: [],
        news: []
      };
    }
    const response = await fetch(`${API_URL}/page`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: {
        tags: ['page'],
        revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60')
      }
    });
    if (!response.ok) {
      return {
        totalPersons: 0,
        totalMembers: 0,
        totalNeighborhoods: 0,
        totalAssociations: 0,
        neighborhoodsImages: [],
        news: []
      };
    }
    const data: PageData = await response.json();
    return data;
  } catch (error) {
    return {
      totalPersons: 0,
      totalMembers: 0,
      totalNeighborhoods: 0,
      totalAssociations: 0,
      neighborhoodsImages: [],
      news: []
    };
  }
};

export const getNoticeByTitle = async (
  title: string
): Promise<Notice | null> => {
  try {
    if (!API_URL) return null;
    const response = await fetch(
      `${API_URL}/news/title/${encodeURIComponent(title)}`,
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

export const getNoticeBySlug = async (slug: string): Promise<Notice | null> => {
  try {
    if (!API_URL) return null;
    const response = await fetch(
      `${API_URL}/news/slug/${encodeURIComponent(slug)}`,
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
