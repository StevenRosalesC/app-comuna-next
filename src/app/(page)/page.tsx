import FaqSection from '@/components/page/faq-section';
import LocationSection from '@/components/page/lication-section';
import MiniCardsInfo from '@/components/page/mini-cards-info';
// import { HeroSection } from '@/components/page/hero-section';
// import { NoticesSection } from '@/components/page/notices-section';
import { OthersSection } from '@/components/page/others-section';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// dynamic import for better performance
const HeroSection = dynamic(() => import('@/components/page/hero-section'));
const NoticesSection = dynamic(() => import('@/components/page/notices-section'));

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description:
    'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  category: 'Inicio',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/`,
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/`
  }
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MiniCardsInfo />
      <NoticesSection />
      <OthersSection />
      <FaqSection />
      {/* <FaqSection /> */}
      <LocationSection />
    </>
  );
}
