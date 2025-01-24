import Image from 'next/image';

export default function ContactView() {
  return (
    <div className='mx-auto grid max-w-screen-xl grid-cols-1 gap-8 rounded-lg px-8 py-16 dark:bg-gray-100 dark:text-gray-800 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32'>
      <div className='flex flex-col justify-between'>
        <div className='space-y-2'>
          <h2 className='text-4xl font-bold leading-tight lg:text-5xl'>
            Let&apos;s talk!
          </h2>
          <div className='dark:text-gray-600'>
            Vivamus in nisl metus? Phasellus.
          </div>
        </div>
        <Image
          width={1080}
          height={720}
          src='/not-found.webp'
          alt=''
          className='h-full w-full object-cover'
        />
      </div>
      <form className='space-y-6'>
        <div>
          <label htmlFor='name' className='text-sm'>
            Full name
          </label>
          <input
            id='name'
            type='text'
            placeholder=''
            className='w-full rounded p-3 dark:bg-gray-100'
          />
        </div>
        <div>
          <label htmlFor='email' className='text-sm'>
            Email
          </label>
          <input
            id='email'
            type='email'
            className='w-full rounded p-3 dark:bg-gray-100'
          />
        </div>
        <div>
          <label htmlFor='message' className='text-sm'>
            Message
          </label>
          <textarea
            id='message'
            rows={3}
            className='w-full rounded p-3 dark:bg-gray-100'
          ></textarea>
        </div>
        <button
          type='submit'
          className='w-full rounded p-3 text-sm font-bold uppercase tracking-wide dark:bg-violet-600 dark:text-gray-50'
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
