import { pageNavItems } from '@/constants/data'
import Link from 'next/link'
import React from 'react'

export const FooterSection = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a href="#" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Comuna Bambil Collao
        </a>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          {
            pageNavItems.map((item, index) => (
              <li key={index}>
                <Link
                  className="mr-4 hover:underline md:mr-6"
                  href={item.url}>
                  {item.title}
                </Link>
              </li>
            ))
          }

        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          {new Date().getFullYear()} © Comuna Bambil Collao. Todos los derechos reservados.
          <br />
          Desarrollado por{' '}
          <Link href="https://github.com/StevenRosalesC" className="hover:underline" target='_blank'>Steven Rosales</Link></span>
      </div>
    </footer>
  )
}
