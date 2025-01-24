import React from 'react';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { NoticeMiniCard } from '../notices/notice-mini-card';
import Slider from '../slider';

export const NoticesSection = () => {
  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto mb-8 max-w-screen-sm text-center lg:mb-16'>
          <SubTitle>Noticias recientes en la comunidad</SubTitle>
          <Paragraph size={'lg'}>
            Descubre las últimas noticias y eventos de la comunidad de Bambil
            Collao.
          </Paragraph>
        </div>
      </div>
      <Slider delay={5000}>
        {Array.from({ length: 5 }).map((_, index) => (
          <NoticeMiniCard key={index} />
        ))}
      </Slider>
    </section>
  );
};
