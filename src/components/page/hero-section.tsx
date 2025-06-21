import Image from 'next/image';
import { Title } from '../ui/atoms/title';
import { Paragraph } from '../ui/atoms/paragraph';
// import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Aos from '../aos';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      <Aos />
      <div
        className='mx-auto grid max-w-screen-xl items-center px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0'
        aria-label='Sección principal de bienvenida'
      >
        <div className='animate-fade-in mr-5 place-self-center lg:col-span-7'>
          <Title>Bienvenido a la Comuna Bambil Collao</Title>
          <Paragraph className='md:text-lg lg:mb-8 lg:text-xl'>
            Un sitio web para la comunidad de Bambil Collao, donde podrás
            encontrar información relevante sobre la comuna, noticias, eventos y
            mucho más.
          </Paragraph>
          {/* <div className='flex flex-col lg:flex-row lg:items-center lg:space-x-4 mt-4'>
            <label htmlFor="email-suscripcion" className="sr-only">Correo electrónico</label>
            <Input
              id="email-suscripcion"
              type='email'
              placeholder='Ingresa tu correo electrónico'
              className='w-full'
              aria-label="Ingresa tu correo electrónico para suscribirte"
            />
            <Button className='mt-4 w-full bg-green-700 lg:mt-0 lg:w-auto' aria-label="Suscribirse al boletín">
              Suscribirse
            </Button>
          </div> */}
          <div className='mt-6 flex gap-4'>
            <Link href='/about' passHref legacyBehavior>
              <Button
                asChild
                className='bg-primary px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-primary/90'
                aria-label='Conoce más sobre la comuna'
              >
                <a>Conoce más</a>
              </Button>
            </Link>
            <Link href='/notices' passHref legacyBehavior>
              <Button
                asChild
                variant='outline'
                className='px-6 py-3 font-semibold'
                aria-label='Ver noticias recientes'
              >
                <a>Ver noticias</a>
              </Button>
            </Link>
          </div>
        </div>
        <div
          className='animate-fade-in-img hidden lg:col-span-5 lg:mt-0 lg:flex'
          aria-label='Imagen de la comuna'
        >
          <Image
            src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna.webp?updatedAt=1737254562322'
            width={600}
            height={800}
            className='rounded-lg object-cover shadow-lg'
            alt='Comuna Bambil Collao'
            loading='lazy'
            priority={false}
          />
        </div>
      </div>
    </>
  );
}
