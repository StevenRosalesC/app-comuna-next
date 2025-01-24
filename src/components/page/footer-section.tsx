import { pageNavItems } from '@/constants/data';
import Link from 'next/link';
import React from 'react';

export const FooterSection = () => {
  return (
    <footer className='bg-white p-4 dark:bg-gray-800 md:p-8 lg:p-10'>
      <div className='mx-auto max-w-screen-xl text-center'>
        <a
          href='#'
          className='mb-4 flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white'
        >
          Comuna Bambil Collao
        </a>
        <ul className='mb-6 flex flex-wrap items-center justify-center text-gray-900 dark:text-white'>
          {pageNavItems.map((item, index) => (
            <li key={index}>
              <Link className='mr-4 hover:underline md:mr-6' href={item.url}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <span className='text-sm text-gray-500 dark:text-gray-400 sm:text-center'>
          {new Date().getFullYear()} © Comuna Bambil Collao. Todos los derechos
          reservados.
          <br />
          Desarrollado por{' '}
          <Link
            href='https://github.com/StevenRosalesC'
            className='hover:underline'
            target='_blank'
          >
            Steven Rosales
          </Link>
        </span>
      </div>
    </footer>
  );
};
