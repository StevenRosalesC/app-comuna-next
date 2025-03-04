import Image from 'next/image';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '../ui/table';
import { SubTitle } from '../ui/atoms/sub-title';

import { GalleryCard } from '../gallery-card';
import { Paragraph } from '../ui/atoms/paragraph';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

export const OthersSection = () => {
  return (
    <section className='items-center py-2  '>
      <div data-aos='fade-up'>
        <SubTitle className='text-center text-green-600'>
          Dirigentes de la comuna bambil collao
        </SubTitle>
      </div>
      <div className='mx-auto flex w-full flex-col items-center gap-4 px-4 md:flex-row lg:px-6 lg:py-4'>
        <div className='w-full basis-2/5 py-4 lg:py-12' data-aos='fade-up'>
          <Image
            className='aspect-square  w-full rounded-3xl object-cover md:aspect-auto'
            src='/page/leaders.webp'
            alt='Dirigentes de la comuna bambil collao'
            width={600}
            height={400}
          />
        </div>
        <div className='w-full basis-3/5 py-4 lg:py-12' data-aos='fade-up'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  scope='col'
                  className='px-6 py-3 text-center text-sm font-bold text-green-700 lg:text-lg'
                >
                  Nombre
                </TableCell>
                <TableCell
                  scope='col'
                  className='px-6 py-3 text-center text-sm font-bold text-green-700 lg:text-lg'
                >
                  Cargo
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className='overflow-hidden '>
              <TableRow>
                <TableCell className='text-sm lg:text-lg'>
                  Edison Catuto Tomalá
                </TableCell>
                <TableCell className='text-sm font-bold lg:text-lg'>
                  Presidente
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-sm lg:text-lg '>
                  Karina Catuto Tomalá
                </TableCell>
                <TableCell className='text-sm font-bold lg:text-lg'>
                  Vice Presidente
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-sm lg:text-lg'>
                  Jessenia Quirumbay Ramírez
                </TableCell>
                <TableCell className='text-sm font-bold lg:text-lg'>
                  Secretario
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-sm lg:text-lg'>
                  Nathaly Tomalá Pozo
                </TableCell>
                <TableCell className='text-sm font-bold lg:text-lg'>
                  Tesorero
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-sm lg:text-lg'>
                  Ernesto Tomalá Torres
                </TableCell>
                <TableCell className='text-sm font-bold lg:text-lg'>
                  Síndico
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div data-aos='fade-up'>
        <SubTitle className='pb-2 text-center text-green-600'>
          Barrios de la comuna bambil collao
        </SubTitle>
      </div>
      <div data-aos='fade-up' data-aos-anchor-placement='top-bottom'>
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
    </section>
  );
};
