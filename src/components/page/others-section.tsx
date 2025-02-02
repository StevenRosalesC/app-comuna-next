'use client';
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
import Slider from '../slider';
import { GalleryCard } from '../gallery-card';
import { Paragraph } from '../ui/atoms/paragraph';

export const OthersSection = () => {
  return (
    <section className='items-center bg-white py-8 dark:bg-gray-900  '>
      <SubTitle className='text-center'>
        Dirigentes de la comuna bambil collao
      </SubTitle>
      <div className='mx-auto flex w-full max-w-screen-xl flex-col items-center gap-4 px-4 md:flex-row lg:px-6 lg:py-16'>
        <div className='w-full basis-1/2 py-12'>
          <Image
            className='aspect-video h-[30dvh] w-full rounded-3xl object-cover md:aspect-auto'
            src='https://ik.imagekit.io/stevenrosales/app-comuna/image-1.jpg?updatedAt=1735495243684'
            alt='Dirigentes de la comuna bambil collao'
            width={600}
            height={400}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                scope='col'
                className='px-6 py-3 text-center font-bold'
              >
                Nombre
              </TableCell>
              <TableCell
                scope='col'
                className='px-6 py-3 text-center font-bold'
              >
                Cargo
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Juan Piguave</TableCell>
              <TableCell>Presidente</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Alberto Cruz</TableCell>
              <TableCell>Vice Presidente</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Veronica Rivas</TableCell>
              <TableCell>Secretario</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jose Luis Alvarado</TableCell>
              <TableCell>Tesorero</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maria Jose Alvarado</TableCell>
              <TableCell>Síndico</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Slider delay={5500} key={'nei'}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`nei-${index}`}>
            <GalleryCard alt={`${index}`} key={`nei-${index}`} />
            <Paragraph
              key={`nei-${index}`}
              className='text-center'>Barrio {index + 1}</Paragraph>
          </div>
        ))}
      </Slider>
    </section>
  );
};
