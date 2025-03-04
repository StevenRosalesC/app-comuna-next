import Image from 'next/image';
import { Title } from '../ui/atoms/title';
import { Paragraph } from '../ui/atoms/paragraph';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Aos from '../aos';

export default function HeroSection() {
  return (
    <>
      <Aos />
      <div
        className='mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0'
      >
        <div className='mr-5 place-self-center lg:col-span-7'>
          <Title>Bienvenido a la Comuna Bambil Collao</Title>
          <Paragraph className='md:text-lg lg:mb-8 lg:text-xl'>
            Un sitio web para la comunidad de Bambil Collao, donde podrás
            encontrar información relevante sobre la comuna, noticias, eventos y
            mucho más.
          </Paragraph>
          <div className='flex flex-col lg:flex-row lg:items-center lg:space-x-4'>
            <Input
              type='email'
              placeholder='Ingresa tu correo electrónico'
              className='w-full'
            />
            <Button className='mt-4 w-full bg-green-700 lg:mt-0 lg:w-auto'>
              Suscribirse
            </Button>
          </div>
        </div>
        <div
          className='hidden lg:col-span-5 lg:mt-0 lg:flex '

        >
          <Image
            src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna.webp?updatedAt=1737254562322'
            width={1920}
            height={1080}
            className='rounded-lg object-cover shadow-lg'
            alt='Comuna Bambil Collao'
          />
        </div>
      </div>
    </>
  );
}
