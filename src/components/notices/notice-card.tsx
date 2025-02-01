import Image from 'next/image';
import Link from 'next/link';

export const NoticeCard = () => {
  return (
    <Link
      rel='noopener noreferrer'
      href='/notices/test'
      className='group mx-auto hidden max-w-sm hover:no-underline focus:no-underline dark:bg-gray-50 sm:block'
    >
      <Image
        width={1920}
        height={1080}
        alt=''
        role='presentation'
        className='h-44 w-full rounded object-cover dark:bg-gray-500'
        src='/not-found.webp'
      />
      <div className='space-y-2 p-6'>
        <h3 className='text-2xl font-semibold group-hover:underline group-focus:underline'>
          In usu laoreet repudiare legendos
        </h3>
        <span className='text-xs dark:text-gray-600'>
          {new Date().toLocaleDateString('es-ES', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <p>
          Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur,
          ex has tantas percipit perfecto. At per tempor albucius perfecto, ei
          probatus consulatu patrioque mea, ei vocent delicata indoctum pri.
        </p>
      </div>
    </Link>
  );
};
