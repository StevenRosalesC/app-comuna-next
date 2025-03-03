import { FooterSection } from '@/components/page/footer-section';
import { NavBar } from '@/components/page/nav-bar';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const FabScroll = dynamic(() => import('@/components/fab-scroll'));


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
      <div className='container mx-auto px-5 min-h-[100dvh]'>
        {children}
      </div>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <FooterSection />
      <FabScroll />

    </>
  );
}
