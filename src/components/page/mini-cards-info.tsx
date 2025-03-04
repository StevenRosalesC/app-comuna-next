import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
interface Props {
  data: Data;
}

interface Data {
  persons: number;
  members: number;
  neighborhoods: number;
  associations: number;
}
export default function MiniCardsInfo({ data }: Props) {
  return (
    <section
      className='grid grid-cols-2 gap-4 p-1 md:grid-cols-4'
      data-aos='fade-up'
    >
      <div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-md'>
        <h2 className='text-2xl font-semibold text-green-600'>
          {data.persons}
        </h2>
        <p className='text-lg font-semibold'>Personas</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-md'>
        <h2 className='text-2xl font-semibold text-green-600'>
          {data.members}
        </h2>
        <p className='text-lg font-semibold'>Comuneros</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-md'>
        <h2 className='text-2xl font-semibold text-green-600'>
          {data.neighborhoods}
        </h2>
        <p className='text-lg font-semibold'>Barrios</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-md'>
        <h2 className='text-2xl font-semibold text-green-600'>
          {data.associations}
        </h2>
        <p className='text-lg font-semibold'>Asociaciones</p>
      </div>
    </section>
  );
}
