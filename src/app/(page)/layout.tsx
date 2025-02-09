import { FooterSection } from '@/components/page/footer-section';
import { NavBar } from '@/components/page/nav-bar';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
import React from 'react';
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao ',
  description:
    'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  category: 'Inicio',
  alternates: {
    canonical: `/`,
  },
  openGraph: {
    title: 'Comuna Bambil Collao ',
    description:
      'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/`
  }
};
interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <NavBar />
      <div className='container mx-auto px-5'>{children}</div>
      <FooterSection />
    </>
  );
}
