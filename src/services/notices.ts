import { Notice } from 'types/dashboard';
import apiCommunity from '@/utils/communityApi';

export const getAllNotices = async (): Promise<Notice[]> => {
  try {
    const notices: Notice[] =  await apiCommunity.get<Notice[]>('/news');
    return notices;
  } catch (error) {
    return [];
  }
};

export const getNotice = async (id: string): Promise<Notice | null> => {
  try {
    const notice: Notice = await apiCommunity.get<Notice>(`/news/${id}`);

    return notice;
  } catch (error) {
    return null;
  }
};
export interface NoticeCreation {
  title:         string;
  description:   string;
  coverImageUrl: string;
  content:       string;
}

export const createNotice = async (notice: NoticeCreation): Promise<Notice | null> => {
  try {
    const newNotice: Notice = await apiCommunity.post<Notice>('/news', notice);
    return newNotice;
  } catch (error) {
    return null;
  }
};

export const updateNotice = async (id: string, {
  title,
  description,
  coverImageUrl,
  content
}: NoticeCreation): Promise<Notice | null> => {
  try {
    const updatedNotice: Notice = await apiCommunity.patch<Notice>(`/news/${id}`, {
      title,
      description,
      coverImageUrl: coverImageUrl!== '' ? coverImageUrl : '/not-found.webp',
      content
    });
    return updatedNotice;
  } catch (error) {
    return null;
  }
}