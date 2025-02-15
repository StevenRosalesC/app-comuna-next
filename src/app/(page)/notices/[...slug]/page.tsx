import PostHeader from '@/components/shared/PostHeader';
import PostToc from '@/components/shared/PostToc';
import PostContent from '@/components/shared/PostContent';
import PostSharing from '@/components/shared/PostSharing';
import TiptapRenderer from '@/components/TiptapRenderer/ServerRenderer';

import { notFound } from 'next/navigation';
import { getNotice } from '@/services/notices';
interface Props {
  params: { slug: string; id: string };
}

export default async function PostPage({ params }: Props) {
  const { slug } = params;
  const notice = await getNotice(slug[0]);

  if (!notice) return notFound();
  // function countAllCharacters(selector: string): number {
  //   const div: HTMLElement | null = document.querySelector(selector);
  //   if (!div) return 0;

  //   const text: string = div.textContent || ""; // Obtiene el texto incluyendo elementos hijos
  //   return text.length; // Retorna la cantidad total de caracteres
  // }
  // const allCharacters = countAllCharacters('.article-content');


  // const readingTime = Math.ceil(allCharacters / 1000) || 1;

  return (
    <article className='flex flex-col items-center px-6 py-10 '>
      <PostHeader
        title={notice.title}
        author={'Unknown'}
        createdAt={notice.createdAt || new Date().toISOString()}
        cover={notice.coverImageUrl || '/not-found.jpg'}
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
