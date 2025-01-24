import Link from 'next/link';
import React from 'react';

interface Props {
  name: string;
  href: string;
  className?: string;
  onClick?: () => void;
}

export const NavButton = ({ name, href, className, onClick }: Props) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        `border-b border-gray-100 py-2  pl-3 pr-4 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white ` +
        className
      }
    >
      {name}
    </Link>
  );
};
