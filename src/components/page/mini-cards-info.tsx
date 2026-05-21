import React from 'react';
import { Users, UserCheck, MapPin, Landmark } from 'lucide-react';
import { Paragraph } from '../ui/atoms/paragraph';
import { SubTitle } from '../ui/atoms/sub-title';
interface Props {
  data: Data;
}

interface Data {
  persons: number;
  members: number;
  neighborhoods: number;
  associations: number;
}
const cardInfo = [
  {
    key: 'persons',
    label: 'Personas',
    icon: <Users className='text-blue-500' aria-label='Icono personas' />,
    color: 'text-blue-600',
    tooltip: 'Cantidad total de personas registradas.'
  },
  {
    key: 'members',
    label: 'Comuneros',
    icon: <UserCheck className='text-green-500' aria-label='Icono comuneros' />,
    color: 'text-green-600',
    tooltip: 'Comuneros legalmente reconocidos.'
  },
  {
    key: 'neighborhoods',
    label: 'Barrios',
    icon: <MapPin className='text-orange-500' aria-label='Icono barrios' />,
    color: 'text-orange-600',
    tooltip: 'Barrios o sectores de la comuna.'
  },
  {
    key: 'associations',
    label: 'Asociaciones',
    icon: (
      <Landmark className='text-purple-500' aria-label='Icono asociaciones' />
    ),
    color: 'text-purple-600',
    tooltip: 'Asociaciones registradas en la comuna.'
  }
];
export default function MiniCardsInfo({ data }: Props) {
  return (
    <section
      className='mx-auto max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'
      data-aos='fade-up'
      aria-label='Resumen de la comuna'
    >
      <div className='mx-auto mb-8 max-w-2xl text-center'>
        <SubTitle className='text-primary'>Datos institucionales</SubTitle>
        <Paragraph className='text-muted-foreground' size={'sm'}>
          Un vistazo rápido a la información general registrada en la comuna.
        </Paragraph>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {cardInfo.map((info) => (
          <div
            key={info.key}
            className='flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur transition will-change-transform hover:-translate-y-0.5 hover:shadow-md dark:bg-background/40'
            tabIndex={0}
            aria-label={`${info.label}: ${data[info.key as keyof Data]}`}
          >
            <div className='mb-1' title={info.tooltip}>
              {info.icon}
            </div>
            <h2 className={`text-2xl font-semibold ${info.color}`}>
              {data[info.key as keyof Data]}
            </h2>
            <p className='text-lg font-semibold'>{info.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
