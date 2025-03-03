import { PageData } from 'types';
import { Notice } from 'types/dashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllNews = async (
  limit: number,
  offset: number
): Promise<{ count: number; data: Notice[] }> => {
  try {
    console.log('REVALIDATE', process.env.NEXT_PUBLIC_CACHE_REVALIDATE);
    const response = await fetch(
      `${API_URL}/news?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'force-cache',
        next: {
          revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60'),
          tags: ['news']
        }
      }
    );
    const data: { count: number; data: Notice[] } = await response.json();
    return data;
  } catch (error) {
    return { count: 0, data: [] };
  }
};

export const getNew = async (id: string): Promise<Notice | null> => {
  try {
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
    const data: Notice = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getPageInfo = async (): Promise<PageData> => {
  try {
    const response = await fetch(`${API_URL}/page`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next:{
        tags: ['page'],
        revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60')
      }
    });
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

export const getNoticeByTitle = async (title: string): Promise<Notice | null> => {
  try {
    const response = await fetch(`${API_URL}/news/title/${title}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE || '60'),
        tags: [`news`]
      }
    });
    const data: Notice = await response.json();
    console.log({data})
    return data;
  } catch (error) {
    return null;
  }
}
