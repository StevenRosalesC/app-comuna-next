import AboutView from '@/components/views/about.view';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Acerca de',
  description:
    'Acerca de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  openGraph: {
    title: 'Comuna Bambil Collao | Acerca de',
    description:
      'Acerca de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/about`
  }
};

export default function aboutPage() {
  return (
    <>
      <AboutView />
    </>
  );
}
