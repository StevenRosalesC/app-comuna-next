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
      <section className='mx-auto max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'>
        <div className='mx-auto mb-8 max-w-screen-sm text-center lg:mb-16'>
          <div data-aos='fade-up'>
            <SubTitle className='text-primary'>
              Comunicados y noticias
            </SubTitle>
          </div>
          <div data-aos='fade-up'>
            <Paragraph size={'lg'} className='text-muted-foreground'>
              Información oficial y novedades relevantes para la comunidad y
              para quienes nos visitan.
            </Paragraph>
          </div>
        </div>
        <div data-aos='fade-up'>
          <div className='rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur dark:bg-background/40 md:p-6'>
            <Carousel>
              <CarouselContent>
                {recentNotices.map((notice, index) => (
                  <CarouselItem
                    key={`notice-${index}`}
                    className='md:basis-1/2 lg:basis-1/3'
                  >
                    <NoticeMiniCard {...notice} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious aria-label='Noticia anterior' />
              <CarouselNext aria-label='Siguiente noticia' />
            </Carousel>
          </div>
        </div>

        <div className='mt-8 flex justify-center' data-aos='fade-up'>
          <Link
            type='button'
            href='/notices'
            className='rounded-md border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
            aria-label='Ver todas las noticias'
          >
            Ver todas las publicaciones
          </Link>
        </div>
      </section>
    </>
  );
}
