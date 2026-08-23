import Image from 'next/image';

export default function DashboardLoading() {
  return (
    <div className='flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 py-12'>
      <div className='relative flex items-center justify-center'>
        <div className='h-20 w-20 rounded-full border-3 border-primary/20 border-t-primary animate-spin' />
        <div className='absolute flex items-center justify-center'>
          <Image
            src='/icon.webp'
            className='h-12 w-12 rounded-full object-contain'
            alt='Comuna Bambil Collao Logo'
            width={48}
            height={48}
            priority
          />
        </div>
      </div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-sm font-semibold tracking-tight text-foreground'>
          Comuna Bambil Collao
        </p>
        <p className='text-xs text-muted-foreground animate-pulse'>
          Cargando contenido...
        </p>
      </div>
    </div>
  );
}
