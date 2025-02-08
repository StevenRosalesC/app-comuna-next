'use client';

import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import Logo from '../../assets/logo.svg';
import GithubIcon from '../../assets/github.svg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname();
  const isEditPage = pathname === '/';

  return (
    <header className='sticky top-0 z-50 border-b border-neutral-300 bg-white/20 px-6 backdrop-blur-lg dark:border-neutral-700 dark:bg-[#0d101820]'>
      <div className='mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between gap-6'>
        <Link href='/'>
          <Logo width={100} />
        </Link>
        <Link
          href={isEditPage ? '/post-csr' : '/'}
          className='rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'
        >
          {isEditPage ? 'View Post' : 'Edit Post'}
        </Link>
        <div className='flex gap-5'>
          <ThemeSwitcher />
          <Link href='https://github.com/ndtrung341/next-tiptap'>
            <GithubIcon />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
