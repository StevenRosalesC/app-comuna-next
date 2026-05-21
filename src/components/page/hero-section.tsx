import Image from 'next/image';
import { Title } from '../ui/atoms/title';
import { Paragraph } from '../ui/atoms/paragraph';
import { Button } from '../ui/button';
import Aos from '../aos';
import Link from 'next/link';
import { Landmark, MapPin, Newspaper } from 'lucide-react';

export default function HeroSection() {
  return (
    <>
      <Aos />
      <section
        className='mx-auto max-w-screen-xl px-4 pb-8 pt-6 lg:px-6 lg:pb-16 lg:pt-10'
        aria-label='Sección principal de bienvenida'
      >
        <div className='relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur dark:bg-background/40 md:p-10'>
          <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_20%_0%,hsl(var(--primary)/0.20)_0%,transparent_55%),radial-gradient(70%_60%_at_90%_20%,hsl(var(--primary)/0.10)_0%,transparent_60%)]' />
          <div className='grid items-center gap-10 lg:grid-cols-12'>
            <div className='lg:col-span-7'>
              <div className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground dark:bg-background/50'>
                <Landmark className='h-4 w-4 text-primary' aria-hidden='true' />
                Portal institucional • Turismo comunitario
              </div>
              <Title className='mt-4'>
                <span className='text-primary'>Comuna Bambil Collao</span>
              </Title>
              <Paragraph className='max-w-2xl md:text-lg lg:text-xl'>
                Información institucional, comunicados oficiales y guía básica
                para visitantes en Santa Elena, Ecuador.
              </Paragraph>

              <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
                <Button
                  asChild
                  aria-label='Información institucional'
                >
                  <Link href='/about'>Información institucional</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  aria-label='Comunicados y noticias'
                >
                  <Link href='/notices'>Comunicados y noticias</Link>
                </Button>
                <Button
                  asChild
                  variant='secondary'
                  aria-label='Cómo llegar'
                >
                  <Link href='/#location'>Cómo llegar</Link>
                </Button>
              </div>

              <div className='mt-8 grid gap-3 sm:grid-cols-2'>
                <div className='flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                  <Newspaper
                    className='mt-0.5 h-5 w-5 text-primary'
                    aria-hidden='true'
                  />
                  <div>
                    <p className='font-semibold'>Comunicados oficiales</p>
                    <p className='text-sm text-muted-foreground'>
                      Publicaciones y novedades de interés comunitario.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                  <MapPin
                    className='mt-0.5 h-5 w-5 text-primary'
                    aria-hidden='true'
                  />
                  <div>
                    <p className='font-semibold'>Visita la comuna</p>
                    <p className='text-sm text-muted-foreground'>
                      Ubicación, contacto y referencia para planificar tu viaje.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-5' aria-label='Imagen de la comuna'>
              <div className='relative'>
                <Image
                  src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna.webp?updatedAt=1737254562322'
                  width={800}
                  height={1000}
                  className='aspect-[4/5] w-full rounded-2xl object-cover shadow-lg'
                  alt='Comuna Bambil Collao'
                  loading='lazy'
                  priority={false}
                />
                <div className='absolute bottom-4 left-4 right-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur dark:bg-background/60'>
                  <p className='text-sm font-semibold'>Santa Elena, Ecuador</p>
                  <p className='text-sm text-muted-foreground'>
                    Parroquia Colonche • Bambil Collao
                  </p>
                  <Button
                    asChild
                    size='sm'
                    variant='secondary'
                    className='mt-3 w-full'
                    aria-label='Contacto institucional'
                  >
                    <Link href='/contact'>Contacto institucional</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
