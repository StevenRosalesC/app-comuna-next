import PostHeader from "@/components/shared/PostHeader";
import PostToc from "@/components/shared/PostToc";
import PostContent from "@/components/shared/PostContent";
import PostSharing from "@/components/shared/PostSharing";
import TiptapRenderer from "@/components/TiptapRenderer/ServerRenderer";


import { notFound } from "next/navigation";
import { getNotice } from "@/services/notices";
interface Props {
  params: { slug: string, id: string };
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;
  const notice = await getNotice(slug[0]);

  if (!notice) return notFound();

  const readingTime = Math.ceil(1500 / 150);

  return (
    <article className="py-10 px-6 flex flex-col items-center ">
      <PostHeader
        title={notice.title}
        author={"Unknown"}
        createdAt={notice.createdAt}
        readingTime={readingTime}
        cover="/not-found.webp"
      />
      <div className="grid grid-cols-1 w-full lg:w-auto lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] gap-6 lg:gap-12">
        <PostSharing />
        <PostContent>
          <TiptapRenderer>{notice.content}</TiptapRenderer>
        </PostContent>
        <PostToc />
      </div>
    </article>
  );
}
