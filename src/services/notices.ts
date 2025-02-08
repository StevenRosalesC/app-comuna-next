import { Notice } from "types/dashboard";
import testNotices from "../assets/data/notices.json";

export const getAllNotices = async () :Promise<Notice[]> => {

  const notices: Notice[] = testNotices
  return notices;
}

export const getNotice = async (id: string) :Promise<Notice> => {
  const notice = testNotices.find(notice => notice.id === id);
  if (!notice) {
    throw new Error("Notice not found");
  }
  return notice;
}