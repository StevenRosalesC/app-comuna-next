import { FooterSection } from '@/components/page/footer-section';
import { NavBar } from '@/components/page/nav-bar';
import React from 'react';

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
