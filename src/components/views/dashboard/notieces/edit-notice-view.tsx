import { getNotice } from "@/services/notices";
import { notFound } from "next/navigation";

interface Props {
  id: string;
}
export const EditNoticeView = async ({ id }: Props) => {
  if (!id) notFound();

  const notice = await getNotice(id);
  console.log(notice);

  return (
    <div>EditNoticeView</div>
  )
}
