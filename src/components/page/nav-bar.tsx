"use client";
import { useEffect, useState } from 'react';
import { NavButton } from './nav-button'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavBar = () => {
  const [currentPage, setCurrentPage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems] = useState([
    {
      name: 'Inicio',
      href: '/',
      current: false,
    },
    {
      name: 'Aceca de',
      href: '/about',
      current: false,
    },
    {
      name: 'Noticias',
      href: '/notices',
      current: false,
    },
    {
      name: 'Contacto',
      href: '/contact',
      current: false,
    },
    {
      name: 'Iniciar Sesión',
      href: '/auth/login',
      current: false
    }
  ]);
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname]);

  const checkActive = (pagePath: string) => {
    const isActive = currentPage === pagePath;
    return isActive;
  };

  return (
    <nav className="bg-white border border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 backdrop-blur-lg sticky top-0 ">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Comuna Bambil Collao
          </span>
        </Link>

        <div className="flex items-center">
          <button
            id="menu-toggle"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div
          className={`w-full md:block md:w-auto my-5 `
            + (isMenuOpen ? 'block' : 'hidden')}
          id="mobile-menu"
        >
          <ul className="flex flex-col gap-4 md:gap-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium transition-all ease-in-out duration-300">

            {
              navItems.map((item, index) => (
                <li key={index}>
                  <NavButton
                    name={item.name}
                    href={item.href}
                    // className={checkActive(item.href) ? 'text-blue-700 font-bold' : 'text-gray-700'}
                    className={`${checkActive(item.href) ? 'text-blue-700 font-bold' : 'text-gray-700'} 
                    
                    `}
                    onClick={() => setIsMenuOpen(false)}

                  />
                </li>
              ))
            }
          </ul>
        </div>

      </div>
    </nav>
  )
}
