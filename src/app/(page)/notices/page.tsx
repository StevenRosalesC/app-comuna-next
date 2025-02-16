import NoticesView from '@/components/views/notices.view';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Noticias',
  description:
    'Noticias de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  alternates: {
    canonical: `/notices`,
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Noticias',
    description:
      'Noticias de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/notices`
  }
};

export default function NoticesPage() {
  return (
    <>
      <NoticesView />
    </>
  );
}
