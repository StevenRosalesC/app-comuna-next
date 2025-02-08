import ContactView from '@/components/views/contact.view';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Contacto',
  description:
    'Contacto de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  openGraph: {
    title: 'Comuna Bambil Collao | Contacto',
    description:
      'Contacto de la Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/contact`
  }
};

export default function aboutPage() {
  return (
    <>
      <ContactView />
    </>
  );
}
