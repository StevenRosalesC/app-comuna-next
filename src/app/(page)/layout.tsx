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
    canonical: `/`
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
      <main className='min-h-[100dvh]'>{children}</main>
      <div className='fixed inset-0 -z-10 h-full w-full bg-background'></div>
      <div className='fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(60%_50%_at_20%_0%,hsl(var(--primary)/0.16)_0%,transparent_55%),radial-gradient(50%_45%_at_90%_10%,hsl(var(--primary)/0.10)_0%,transparent_60%)]'></div>
      <div className='fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--foreground)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.04)_1px,transparent_1px)] bg-[size:14px_24px]'></div>
      <FooterSection />
      <FabScroll />
    </>
  );
}
