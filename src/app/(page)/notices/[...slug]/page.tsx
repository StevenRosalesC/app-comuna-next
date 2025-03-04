import PostHeader from '@/components/shared/PostHeader';
import PostToc from '@/components/shared/PostToc';
import PostContent from '@/components/shared/PostContent';
import PostSharing from '@/components/shared/PostSharing';
import TiptapRenderer from '@/components/TiptapRenderer/ServerRenderer';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getNoticeByTitle } from '@/services/page';
import { Notice } from 'types/dashboard';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const notice = await getNoticeByTitle(slug[0]);
  return {
    title: `Comuna Bambil Collao | ${notice?.title}`,
    description: notice?.description,
    alternates: {
      canonical: `https://${NEXT_PUBLIC_APP_URL}/notices/${notice?.title}`
    },
    openGraph: {
      title: `Comuna Bambil Collao | ${notice?.title}`,
      description: notice?.description,
      url: `https://${NEXT_PUBLIC_APP_URL}/notices/${notice?.title}`,
      images: [
        {
          url: notice?.coverImageUrl || '/not-found.jpg',
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

const jsonLd = async (slug: string[]) => {
  const notice = await getNoticeByTitle(slug[0]);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      url: `https://${NEXT_PUBLIC_APP_URL}/notices/${notice?.title}`
    },
    headline: notice?.title,
    image: notice?.coverImageUrl || '/not-found.jpg',
    datePublished: notice?.createdAt || new Date().toISOString(),
    dateModified: notice?.updatedAt || new Date().toISOString(),
    author: notice?.createdBy
  };
};

interface Props {
  params: { slug: string; id: string };
}

export default async function PreviewNotice({ params }: Props) {
  const { slug } = params;
  let notice;
  let readingTime = 1;
  try {
    notice = await getNoticeByTitle(slug[0]);
    if (!notice) return notFound();
    const allCharacters = notice.content.replace(/<[^>]*>/g, '').trim().length;
    readingTime = Math.ceil(allCharacters / 1000) || 1;
  } catch (error) {
    return notFound();
  }

  return (
    <>
      <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
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
    </>
  );
}
