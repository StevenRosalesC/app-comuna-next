import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LoginForm from '@/components/auth/login-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function LoginViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex order-last'>
        <div className='absolute inset-0 bg-zinc-900'>
          <Image
            src='https://ik.imagekit.io/stevenrosales/app-comuna/background.jpg?updatedAt=1737246840837'
            alt='Logo'
            layout='fill'
            className='object-cover brightness-50'
          />
        </div>
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <span
            className='text-2xl font-bold tracking-tight text-white dark:text-white w-full text-end'
          >
            COMUNA BAMBIL COLLAO
          </span>
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg text-end'>
              &ldquo;Trabajando por una mejor comunidad.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Inicia sesión
            </h1>
            <p className='text-sm text-muted-foreground'>
              Inicia sesión para acceder a tu cuenta
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
