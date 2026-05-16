import { pageNavItems } from '@/constants/data';
import Link from 'next/link';
import React from 'react';

export const FooterSection = () => {
  return (
    <footer className='border-t bg-background/80 p-4 backdrop-blur md:p-8 lg:p-10'>
      <div className='mx-auto max-w-screen-xl text-center'>
        <a
          href='#'
          className='mb-4 flex items-center justify-center text-2xl font-semibold text-foreground'
        >
          Comuna Bambil Collao
        </a>
        <ul className='mb-6 flex flex-wrap items-center justify-center text-foreground'>
          {pageNavItems.map((item, index) => (
            <li key={index}>
              <Link
                className='mr-4 hover:underline md:mr-6'
                href={item.url}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <span className='text-sm text-muted-foreground sm:text-center'>
          {new Date().getFullYear()} © Comuna Bambil Collao. Todos los derechos
          reservados.
          <br />
          Desarrollado por{' '}
          <Link
            href='https://github.com/StevenRosalesC'
            className='font-bold text-primary hover:underline'
            target='_blank'
          >
            Steven Rosales
          </Link>
        </span>
      </div>
    </footer>
  );
};
