'use client';
import React from 'react';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { NoticeMiniCard } from '../notices/notice-mini-card';
import Link from 'next/link';
import { News } from 'types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface Props {
  notices: News[];
}
export default function NoticesSection({ notices }: Props) {
  // Mostrar solo las 3 noticias más recientes
  const recentNotices = notices.slice(0, 3);
  return (
    <>
      <section className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto mb-8 max-w-screen-sm text-center lg:mb-16'>
          <div data-aos='fade-up'>
            <SubTitle className='text-green-600'>
              Actualízate con nuestras noticias locales
            </SubTitle>
          </div>
          <div data-aos='fade-up'>
            <Paragraph size={'lg'}>
              Mantente informado sobre lo que sucede en tu comunidad. Aquí
              encontrarás noticias importantes y eventos que no te puedes
              perder.
            </Paragraph>
          </div>
        </div>
        <div data-aos='fade-up'>
          <Carousel>
            <CarouselContent>
              {recentNotices.map((notice, index) => (
                <CarouselItem
                  key={`notice-${index}`}
                  className='md:basis-1/2 lg:basis-1/3 animate-fade-in-card'
                >
                  <NoticeMiniCard {...notice} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious aria-label="Noticia anterior" />
            <CarouselNext aria-label="Siguiente noticia" />
          </Carousel>
        </div>

        <div className='mt-8 flex justify-center' data-aos='fade-up'>
          <Link
            type='button'
            href='/notices'
            className='rounded-md border border-primary bg-primary text-white px-6 py-3 text-sm font-semibold shadow hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            aria-label='Ver todas las noticias'
          >
            Ver más noticias...
          </Link>
        </div>
      </section>
    </>
  );
}
