import FaqSection from '@/components/page/faq-section';
import LocationSection from '@/components/page/lication-section';
import MiniCardsInfo from '@/components/page/mini-cards-info';
import { OthersSection } from '@/components/page/others-section';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getPageInfo } from '@/services/page';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageData } from 'types';

// dynamic import for better performance
const HeroSection = dynamic(() => import('@/components/page/hero-section'));
const NoticesSection = dynamic(
  () => import('@/components/page/notices-section')
);

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description:
    'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  category: 'Inicio',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/home`
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/`
  }
};

export default async function HomePage() {
  const data: PageData = await getPageInfo();
  return (
    <>
      <HeroSection />
      <MiniCardsInfo
        data={{
          persons: data.totalPersons,
          neighborhoods: data.totalNeighborhoods,
          associations: data.totalAssociations,
          members: data.totalMembers
        }}
      />
      {data ? (
        <NoticesSection notices={data.news} />
      ) : (
        <NoticesSection notices={[]} />
      )}
      <OthersSection />
      <FaqSection />
      <LocationSection />
    </>
  );
}
