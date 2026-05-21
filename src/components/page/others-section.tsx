import Image from 'next/image';
import React from 'react';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { GalleryCard } from '../gallery-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

export const OthersSection = () => {
  const leaders = [
    { name: 'Edison Catuto Tomalá', role: 'Presidente' },
    { name: 'Karina Catuto Tomalá', role: 'Vicepresidente' },
    { name: 'Jessenia Quirumbay Ramírez', role: 'Secretario' },
    { name: 'Nathaly Tomalá Pozo', role: 'Tesorero' },
    { name: 'Ernesto Tomalá Torres', role: 'Síndico' }
  ];

  return (
    <section
      id='authorities'
      className='mx-auto max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'
    >
      <div data-aos='fade-up'>
        <SubTitle className='text-center text-primary'>
          Autoridades comunales
        </SubTitle>
        <Paragraph className='mx-auto max-w-2xl text-center text-muted-foreground' size={'sm'}>
          Estructura directiva y representación comunitaria para la gestión
          institucional.
        </Paragraph>
      </div>
      <div className='mt-8 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-5' data-aos='fade-up'>
          <Image
            className='aspect-[4/3] w-full rounded-3xl object-cover shadow-sm'
            src='/page/leaders.webp'
            alt='Autoridades de la Comuna Bambil Collao'
            width={600}
            height={400}
          />
        </div>
        <div className='lg:col-span-7' data-aos='fade-up'>
          <div className='rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur dark:bg-background/40'>
            <div className='grid gap-3 sm:grid-cols-2'>
              {leaders.map((leader) => (
                <div
                  key={leader.name}
                  className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'
                >
                  <p className='text-sm font-semibold text-muted-foreground'>
                    {leader.role}
                  </p>
                  <p className='text-lg font-semibold'>{leader.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id='neighborhoods' className='mt-12' data-aos='fade-up'>
        <SubTitle className='pb-2 text-center text-primary'>
          Barrios y sectores
        </SubTitle>
        <Paragraph className='mx-auto max-w-2xl text-center text-muted-foreground' size={'sm'}>
          Conoce los barrios de la comuna y su organización territorial.
        </Paragraph>
      </div>
      <div data-aos='fade-up' data-aos-anchor-placement='top-bottom'>
        <div className='rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur dark:bg-background/40 md:p-6'>
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={`nei-${index}`}
                  className='md:basis-1/2 lg:basis-1/3'
                >
                  <div className='flex flex-col items-center'>
                    <GalleryCard alt={`${index}`} key={`nei-${index}`} />
                    <p className='mt-0 text-center text-sm font-medium'>
                      Barrio {index + 1}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
