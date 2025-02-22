import { Notice } from 'types/dashboard';
import apiCommunity from '@/utils/communityApi';
import { NoticeCreation } from 'types/notices';

export const getAllNotices = async (): Promise<Notice[]> => {
  try {
    const {data:notices} =  await apiCommunity.get<Notice[]>('/news');
    return notices;
  } catch (error) {
    return [];
  }
};

export const getNotice = async (id: string): Promise<Notice | null> => {
  try {
    const {data:notice} = await apiCommunity.get<Notice>(`/news/${id}`);
    return notice;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const createNotice = async (notice: NoticeCreation): Promise<Notice | null> => {
  try {
    const { data: newNotice } = await apiCommunity.post<Notice>('/news', notice);
    return newNotice;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const updateNotice = async (id: string, {
  title,
  description,
  coverImageUrl,
  content,
  type
}: NoticeCreation): Promise<Notice | null> => {
  try {
    const {data:updatedNotice} = await apiCommunity.patch<Notice>(`/news/${id}`, {
      title,
      description,
      coverImageUrl: coverImageUrl!== '' ? coverImageUrl : '/not-found.webp',
      content,
      type
    });
    return updatedNotice;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}