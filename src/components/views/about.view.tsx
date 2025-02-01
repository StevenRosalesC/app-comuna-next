import Image from 'next/image';

export default function AboutView() {
  return (
    <div>
      <div className='px-4 py-9 2xl:container md:px-6 md:py-12 lg:px-20 lg:py-16 2xl:mx-auto'>
        <div className='flex flex-col justify-between gap-8 lg:flex-row'>
          <div className='flex w-full flex-col justify-center lg:w-5/12'>
            <h1 className='pb-4 text-3xl font-bold leading-9 text-gray-800 lg:text-4xl'>
              About Us
            </h1>
            <p className='text-base font-normal leading-6 text-gray-600 '>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum.In the first place we have granted to
              God, and by this our present charter confirmed for us and our
              heirs forever that the English Church shall be free, and shall
              have her rights entire, and her liberties inviolate; and we will
              that it be thus observed; which is apparent from
            </p>
          </div>
          <div className='w-full lg:w-8/12 '>
            <Image
              width={1920}
              height={1080}
              className='h-full w-full'
              src='https://ik.imagekit.io/stevenrosales/app-comuna/bambil.jpg?updatedAt=1737682578946'
              alt='A group of People'
            />
          </div>
        </div>

        <div className='flex flex-col justify-between gap-8 pt-12 lg:flex-row'>
          <div className='flex w-full flex-col justify-center lg:w-5/12'>
            <h1 className='pb-4 text-3xl font-bold leading-9 text-gray-800 lg:text-4xl'>
              Our Story
            </h1>
            <p className='text-base font-normal leading-6 text-gray-600 '>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum.In the first place we have granted to
              God, and by this our present charter confirmed for us and our
              heirs forever that the English Church shall be free, and shall
              have her rights entire, and her liberties inviolate; and we will
              that it be thus observed; which is apparent from
            </p>
          </div>
          <div className='w-full lg:w-8/12 lg:pt-8'>
            <div className='grid grid-cols-1 rounded-md shadow-lg sm:grid-cols-2 md:grid-cols-4 lg:gap-4'>
              <div className='flex flex-col items-center justify-center p-4 pb-6'>
                <Image
                  width={100}
                  height={100}
                  className='hidden md:block'
                  src='https://i.ibb.co/FYTKDG6/Rectangle-118-2.png'
                  alt='Alexa featured Img'
                />
                <Image
                  width={100}
                  height={100}
                  className='block md:hidden'
                  src='https://i.ibb.co/zHjXqg4/Rectangle-118.png'
                  alt='Alexa featured Img'
                />
                <p className='mt-4 text-xl font-medium leading-5 text-gray-800'>
                  Alexa
                </p>
              </div>
              <div className='flex flex-col items-center justify-center p-4 pb-6'>
                <Image
                  width={100}
                  height={100}
                  className='hidden md:block'
                  src='https://i.ibb.co/fGmxhVy/Rectangle-119.png'
                  alt='Olivia featured Img'
                />
                <Image
                  width={100}
                  height={100}
                  className='block md:hidden'
                  src='https://i.ibb.co/NrWKJ1M/Rectangle-119.png'
                  alt='Olivia featured Img'
                />
                <p className='mt-4 text-xl font-medium leading-5 text-gray-800'>
                  Olivia
                </p>
              </div>
              <div className='flex flex-col items-center justify-center p-4 pb-6'>
                <Image
                  width={100}
                  height={100}
                  className='hidden md:block'
                  src='https://i.ibb.co/Pc6XVVC/Rectangle-120.png'
                  alt='Liam featued Img'
                />
                <Image
                  width={100}
                  height={100}
                  className='block md:hidden'
                  src='https://i.ibb.co/C5MMBcs/Rectangle-120.png'
                  alt='Liam featued Img'
                />
                <p className='mt-4 text-xl font-medium leading-5 text-gray-800'>
                  Liam
                </p>
              </div>
              <div className='flex flex-col items-center justify-center p-4 pb-6'>
                <Image
                  width={100}
                  height={100}
                  className='hidden md:block'
                  src='https://i.ibb.co/7nSJPXQ/Rectangle-121.png'
                  alt='Elijah featured img'
                />
                <Image
                  width={100}
                  height={100}
                  className='block md:hidden'
                  src='https://i.ibb.co/ThZBWxH/Rectangle-121.png'
                  alt='Elijah featured img'
                />
                <p className='mt-4 text-xl font-medium leading-5 text-gray-800'>
                  Elijah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className='bg-white dark:bg-gray-900'>
        <div className='mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16'>
          <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
            <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
              We didn&apos;t reinvent the wheel
            </h2>
            <p className='mb-4'>
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick, but big
              enough to deliver the scope you want at the pace you need. Small
              enough to be simple and quick, but big enough to deliver the scope
              you want at the pace you need.
            </p>
            <p>
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick.
            </p>
          </div>
          <div className='mt-8 grid grid-cols-2 gap-4'>
            <Image
              width={1920}
              height={1080}
              className='w-full rounded-lg'
              src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png'
              alt='office content 1'
            />
            <Image
              width={1920}
              height={1080}
              className='mt-4 w-full rounded-lg lg:mt-10'
              src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png'
              alt='office content 2'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
