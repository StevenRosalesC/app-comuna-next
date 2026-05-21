import FaqSection from '@/components/page/faq-section';
import LocationSection from '@/components/page/lication-section';
import MiniCardsInfo from '@/components/page/mini-cards-info';
import { OthersSection } from '@/components/page/others-section';
import TourismSection from '@/components/page/tourism-section';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { getPageInfo } from '@/services/page';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageData } from 'types';

const HeroSection = dynamic(() => import('@/components/page/hero-section'));
const NoticesSection = dynamic(
  () => import('@/components/page/notices-section')
);

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description:
    'Descubre la Comuna Bambil Collao en Santa Elena, Ecuador. Noticias, eventos, comuneros, barrios y asociaciones. Participa y mantente informado sobre tu comunidad.',
  keywords: [
    'Comuna Bambil Collao',
    'Santa Elena',
    'Colonche',
    'comunidad',
    'noticias',
    'eventos',
    'comuneros',
    'barrios',
    'asociaciones',
    'Ecuador',
    'Bambil Collao'
  ],
  authors: [
    {
      name: 'Comuna Bambil Collao',
      url: `https://${NEXT_PUBLIC_APP_URL}/about`
    }
  ],
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/`
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Descubre la Comuna Bambil Collao en Santa Elena, Ecuador. Noticias, eventos, comuneros, barrios y asociaciones. Participa y mantente informado sobre tu comunidad.',
    url: `https://${NEXT_PUBLIC_APP_URL}/`,
    siteName: 'Comuna Bambil Collao',
    images: [
      {
        url: `https://${NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Comuna Bambil Collao - Imagen destacada'
      }
    ],
    locale: 'es_EC',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Descubre la Comuna Bambil Collao en Santa Elena, Ecuador. Noticias, eventos, comuneros, barrios y asociaciones. Participa y mantente informado sobre tu comunidad.',
    images: [`https://${NEXT_PUBLIC_APP_URL}/og-image.jpg`]
  }
};

export default async function HomePage() {
  const data: PageData = await getPageInfo();
  return (
    <>
      <script type='application/ld+json' suppressHydrationWarning>{`
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Comuna Bambil Collao",
          "image": "https://${NEXT_PUBLIC_APP_URL}/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Barrio 3 de Noviembre - Frente a la cancha de uso múltiple",
            "addressLocality": "Bambil Collao",
            "addressRegion": "Santa Elena",
            "addressCountry": "EC"
          },
          "url": "https://${NEXT_PUBLIC_APP_URL}/",
          "email": "22defebrerobambil@gmail.com",
          "telephone": "+593 99 999 9999"
        }
      `}</script>
      <HeroSection />
      <TourismSection />
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
