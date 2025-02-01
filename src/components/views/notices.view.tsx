import Image from 'next/image';
import Link from 'next/link';
import { NoticeCard } from '../notices/notice-card';

export default function NoticesView() {
  return (
    <section className='dark:bg-gray-100 dark:text-gray-800'>
      <div className='container mx-auto max-w-6xl space-y-6 p-6 sm:space-y-12'>
        <Link
          rel='noopener noreferrer'
          href='/notices/test'
          className='group mx-auto block max-w-sm gap-3 hover:no-underline focus:no-underline dark:bg-gray-50 sm:max-w-full lg:grid lg:grid-cols-12'
        >
          <Image
            width={1920}
            height={1080}
            alt=''
            src='https://ik.imagekit.io/stevenrosales/app-comuna/bc.jpg?updatedAt=1737682943108'
            className='h-64 w-full rounded object-cover dark:bg-gray-500 sm:h-96 lg:col-span-7'
          />
          <div className='space-y-2 p-6 lg:col-span-5'>
            <h3 className='text-2xl font-semibold group-hover:underline group-focus:underline sm:text-4xl'>
              Noster tincidunt reprimique ad pro
            </h3>
            <span className='text-xs dark:text-gray-600'>
              {new Date().toLocaleDateString('es-ES', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <p>
              Ei delenit sensibus liberavisse pri. Quod suscipit no nam. Est in
              graece fuisset, eos affert putent doctus id.
            </p>
          </div>
        </Link>
        <div className='grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <NoticeCard key={index} />
          ))}
        </div>
        <div className='flex justify-center'>
          <button
            type='button'
            className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-50 dark:text-gray-600'
          >
            Load more posts...
          </button>
        </div>
      </div>
    </section>
  );
}
