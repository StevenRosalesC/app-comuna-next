import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { JSX, SVGProps } from 'react';
import { pageNavItems } from '@/constants/data';
import Image from 'next/image';

export function NavBar() {
  return (
    <header className='sticky top-0 z-50 flex h-20 w-full shrink-0 items-center bg-white px-4 md:px-6 '>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='lg:hidden'>
            <MenuIcon className='h-6 w-6' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <Link href='#' className='mr-6 hidden lg:flex' prefetch={false}>
            <Image
              src='/icon.webp'
              alt='Comuna Bambil Collao'
              width={120}
              height={120}
            />
            <span className='sr-only'>Comuna Bambil Collao</span>
          </Link>
          <div className='grid gap-2 py-6'>
            {pageNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className='flex w-full items-center py-2 text-lg font-semibold'
                prefetch={false}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href='/' className='mr-6 hidden lg:flex' prefetch={false}>
        <Image
          src='/icon.webp'
          alt='Comuna Bambil Collao'
          className='h-14 w-full rounded-full object-cover'
          width={120}
          height={120}
        />
        <span className='sr-only'>Comuna Bambil Collao</span>
      </Link>
      <nav className='ml-auto hidden gap-6 lg:flex '>
        {pageNavItems.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className='text-md group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
            prefetch={false}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  );
}
