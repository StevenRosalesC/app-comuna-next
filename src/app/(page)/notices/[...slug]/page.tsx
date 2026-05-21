import PostHeader from '@/components/shared/PostHeader';
import PostToc from '@/components/shared/PostToc';
import PostContent from '@/components/shared/PostContent';
import PostSharing from '@/components/shared/PostSharing';
import TiptapRenderer from '@/components/TiptapRenderer/ServerRenderer';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getNoticeBySlug } from '@/services/page.server';
import Script from 'next/script';
import { Notice } from 'types/dashboard';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug[0]);
  const canonicalSlug = notice?.slug || slug[0];
  return {
    title: `Comuna Bambil Collao | ${notice?.title}`,
    description: notice?.description,
    alternates: {
      canonical: `https://${NEXT_PUBLIC_APP_URL}/notices/${canonicalSlug}`
    },
    openGraph: {
      title: `Comuna Bambil Collao | ${notice?.title}`,
      description: notice?.description,
      url: `https://${NEXT_PUBLIC_APP_URL}/notices/${canonicalSlug}`,
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

const buildJsonLd = (notice: Notice, canonicalSlug: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      url: `https://${NEXT_PUBLIC_APP_URL}/notices/${canonicalSlug}`
    },
    headline: notice?.title,
    image: notice?.coverImageUrl || '/not-found.jpg',
    datePublished: notice?.createdAt || new Date().toISOString(),
    dateModified: notice?.updatedAt || new Date().toISOString(),
    author: notice?.createdBy
  };
};

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function PreviewNotice({ params }: Props) {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug[0]);
  if (!notice) return notFound();

  const contentPlainText = (notice.content || '')
    .replace(/<[^>]*>/g, '')
    .trim();
  const readingTime = Math.ceil(contentPlainText.length / 1000) || 1;

  const canonicalSlug = notice.slug || slug[0];
  const jsonLd = buildJsonLd(notice, canonicalSlug);

  return (
    <>
      <Script
        id={`notice-jsonld-${notice.newsId}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className='flex flex-col items-center px-6 py-10 '>
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
      </section>
    </>
  );
}
