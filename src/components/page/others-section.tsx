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
    <section className='items-center bg-white py-2 dark:bg-gray-900  '>
      <SubTitle className='text-center'>
        Dirigentes de la comuna bambil collao
      </SubTitle>
      <div className='mx-auto flex w-full flex-col items-center gap-4 px-4 md:flex-row lg:px-6 lg:py-4'>
        <div className='w-full basis-3/4 py-12'>
          <Image
            className='aspect-square  w-full rounded-3xl object-cover md:aspect-auto'
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
              <TableCell>Edison Catuto Tomalá</TableCell>
              <TableCell>Presidente</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Karina Catuto Tomalá</TableCell>
              <TableCell>Vice Presidente</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jessenia Quirumbay Ramírez</TableCell>
              <TableCell>Secretario</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nathaly Tomalá Pozo</TableCell>
              <TableCell>Tesorero</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ernesto Tomalá Torres</TableCell>
              <TableCell>Síndico</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <SubTitle className='pb-2 text-center'>
        Barrios de la comuna bambil collao
      </SubTitle>
      <Slider delay={5500} key={'nei'}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`nei-${index}`}>
            <GalleryCard alt={`${index}`} key={`nei-${index}`} />
            <Paragraph key={`nei-${index}`} className='text-center'>
              Barrio {index + 1}
            </Paragraph>
          </div>
        ))}
      </Slider>
    </section>
  );
};
