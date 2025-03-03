import PostHeader from '@/components/shared/PostHeader';
import PostToc from '@/components/shared/PostToc';
import PostContent from '@/components/shared/PostContent';
import PostSharing from '@/components/shared/PostSharing';
import TiptapRenderer from '@/components/TiptapRenderer/ServerRenderer';

import { notFound } from 'next/navigation';
import { getNotice } from '@/services/notices';
interface Props {
  params: { id: string };
}

export default async function PreviewNotice({ params }: Props) {
  const { id } = params;
  const notice = await getNotice(id);

  if (!notice) return notFound();
  const allCharacters = notice.content
    .replace(/<[^>]*>/g, '')
    .trim().length
  const readingTime = Math.ceil(allCharacters / 1000) || 1;

  return (
    <article className='flex flex-col items-center px-6 py-10 '>
      <PostHeader
        title={notice.title}
        author={notice.createdBy}
        createdAt={notice.createdAt || new Date().toISOString()}
        cover={notice.coverImageUrl || '/not-found.jpg'}
        readingTime={readingTime}
      />
      <div className='grid w-full grid-cols-1 gap-6 lg:w-auto lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] lg:gap-12'>
        <PostSharing />
        <PostContent>
          <TiptapRenderer>{notice.content}</TiptapRenderer>
        </PostContent>
        <PostToc />
      </div>
    </article>
  );
}
