import Image from 'next/image';

export default function LoadingPage() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6'>
      <div className='relative flex items-center justify-center'>
        <div className='h-16 w-16 rounded-full border-3 border-primary/20 border-t-primary animate-spin' />
        <div className='absolute flex items-center justify-center'>
          <Image
            src='/icon.webp'
            className='h-10 w-10 rounded-full object-contain'
            alt='Logo'
            width={40}
            height={40}
            priority
          />
        </div>
      </div>
      <p className='text-xs text-muted-foreground animate-pulse'>
        Cargando página...
      </p>
    </div>
  );
}
