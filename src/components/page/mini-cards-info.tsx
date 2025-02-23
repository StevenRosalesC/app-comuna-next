import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
interface Props {
  data: Data
}

interface Data {
  persons: number;
  members: number;
  neighborhoods: number;
  associations: number;

}
export default function MiniCardsInfo({ data }: Props) {
  return (
    <section className='p-1 grid grid-cols-2 md:grid-cols-4 gap-4' data-aos="fade-up">
      <div className='flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold'>{data.persons}</h3>
        <p className='text-lg font-semibold'>Personas</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold'>{data.members}</h3>
        <p className='text-lg font-semibold'>Comuneros</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold'>{data.neighborhoods}</h3>
        <p className='text-lg font-semibold'>Barrios</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-md'>
        <h3 className='text-2xl font-semibold'>{data.associations}</h3>
        <p className='text-lg font-semibold'>Asociaciones</p>
      </div>
    </section>
  )
}
