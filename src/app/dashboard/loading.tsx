import Image from 'next/image';

export default function loading() {
  return (
    <div className='relative flex h-screen w-screen items-center justify-center gap-5'>
      <div className='flex items-center justify-center'>
        <div className='absolute h-32 w-32 animate-spin rounded-md border-4  border-emerald-500'></div>
        <Image
          src='/icon.webp'
          className='h-28 w-28 animate-horizontal-spin rounded-full'
          alt='Tailwindflex Logo'
          width={100}
          height={100}
        />
      </div>
      <span className='text-2xl text-emerald-500'>
        Comuna Bambil Collao, Espere un momento...
      </span>
    </div>
  );
}
