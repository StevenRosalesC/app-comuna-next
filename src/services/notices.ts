import { Notice } from 'types/dashboard';
import testNotices from '../assets/data/notices.json';

export const getAllNotices = async (): Promise<Notice[]> => {
  const notices: Notice[] = testNotices;
  return notices;
};

export const getNotice = async (id: string): Promise<Notice | null> => {
  const notice = testNotices.find((notice) => notice.id === id);
  if (!notice) {
    return null;
  }
  return notice;
};
