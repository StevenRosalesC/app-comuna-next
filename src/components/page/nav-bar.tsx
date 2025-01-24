'use client';
import { useEffect, useState } from 'react';
import { NavButton } from './nav-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from 'types';
import { pageNavItems } from '@/constants/data';

export const NavBar = () => {
  const [currentPage, setCurrentPage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems] = useState<NavItem[]>(pageNavItems);
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname]);

  const checkActive = (pagePath: string) => {
    const isActive = currentPage === pagePath;
    return isActive;
  };

  return (
    <nav className='sticky top-0 z-50 rounded border border-gray-200 bg-white px-2 py-2.5 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800 sm:px-4 '>
      <div className='container mx-auto flex flex-wrap items-center justify-between'>
        <Link href='/' className='flex items-center'>
          <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
            Comuna Bambil Collao
          </span>
        </Link>

        <div className='flex items-center'>
          <button
            id='menu-toggle'
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16m-7 6h7'
              />
            </svg>
          </button>
        </div>

        <div
          className={
            `my-5 w-full md:block md:w-auto ` +
            (isMenuOpen ? 'block' : 'hidden')
          }
          id='mobile-menu'
        >
          <ul className='mt-4 flex flex-col gap-4 transition-all duration-300 ease-in-out md:mt-0 md:flex-row md:gap-0 md:space-x-8 md:text-sm md:font-medium'>
            {navItems.map((item, index) => (
              <li key={index}>
                <NavButton
                  name={item.title}
                  href={item.url}
                  // className={checkActive(item.href) ? 'text-blue-700 font-bold' : 'text-gray-700'}
                  className={`${
                    checkActive(item.url)
                      ? 'font-bold text-blue-700'
                      : 'text-gray-700'
                  } 
                    
                    `}
                  onClick={() => setIsMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
