import NoticesView from '@/components/views/notices.view';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Noticias',
  description:
    'Noticias de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/notices`
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Noticias',
    description:
      'Noticias de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/notices`
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'Comuna Bambil Collao',
  url: `${NEXT_PUBLIC_APP_URL}/notices`,
  logo: `${NEXT_PUBLIC_APP_URL}/logo.png`,
  sameAs: [
    'https://www.facebook.com/comunabambilcollao',
    'https://www.instagram.com/comunabambilcollao',
    'https://www.youtube.com/@comunabambilcollao'
  ]
};

export default function NoticesPage() {
  return (
    <main>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      <NoticesView />
    </main>
  );
}
