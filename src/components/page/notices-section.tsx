import React from 'react';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { NoticeMiniCard } from '../notices/notice-mini-card';
import Slider from '../slider';
import Link from 'next/link';

interface NoticePreview {
  createdAt: string;
  title: string;
  description: string;
  writer: string;
  noticeId: string;
}

export const NoticesSection = () => {
  const notices: NoticePreview[] = [
    {
      createdAt: '2025-01-31T12:00:00Z',
      title: 'Nueva ley de seguridad ciudadana',
      description:
        'La nueva ley de seguridad ciudadana ha sido aprobada por el congreso. Conoce los detalles de esta nueva normativa.',
      writer: 'Jese Leos',
      noticeId: '1'
    },
    {
      createdAt: '2025-01-30T12:00:00Z',
      title: 'Evento de reforestación',
      description:
        'Este sábado 30 de enero se llevará a cabo un evento de reforestación en el parque central de la ciudad. ¡No te lo pierdas!',
      writer: 'Andrea Quintero',
      noticeId: '2'
    },
    {
      createdAt: '2025-01-29T12:00:00Z',
      title: 'Nueva ley de seguridad ciudadana',
      description:
        'La nueva ley de seguridad ciudadana ha sido aprobada por el congreso. Conoce los detalles de esta nueva normativa.',
      writer: 'Jese Leos',
      noticeId: '3'
    },
    {
      createdAt: '2025-01-15T12:00:00Z',
      title: 'Nueva ley de seguridad ciudadana',
      description:
        'La nueva ley de seguridad ciudadana ha sido aprobada por el congreso. Conoce los detalles de esta nueva normativa.',
      writer: 'Jese Leos',
      noticeId: '4'
    },
    {
      createdAt: '2024-12-10T12:00:00Z',
      title: 'Nueva ley de seguridad ciudadana',
      description:
        'La nueva ley de seguridad ciudadana ha sido aprobada por el congreso. Conoce los detalles de esta nueva normativa.',
      writer: 'Jese Leos',
      noticeId: '5'
    }
  ];
  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto mb-8 max-w-screen-sm text-center lg:mb-16'>
          <SubTitle>Actualízate con nuestras noticias locales</SubTitle>
          <Paragraph size={'lg'}>
            Mantente informado sobre lo que sucede en tu comunidad. Aquí
            encontrarás noticias importantes y eventos que no te puedes perder.
          </Paragraph>
        </div>
        <Slider autoplay={false} delay={5000} key={'notices-slider'}>
          {notices.map((notice, index) => (
            <NoticeMiniCard {...notice} key={`notice-${index}`} />
          ))}
        </Slider>

        <div className='mt-8 flex justify-center'>
          <Link
            type='button'
            href='/notices'
            className='rounded-md px-6 py-3 text-sm hover:underline dark:bg-gray-50 dark:text-gray-600'
          >
            Ver más noticias...
          </Link>
        </div>
      </div>
    </section>
  );
};
