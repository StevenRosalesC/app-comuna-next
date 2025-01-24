"use client";
import Image from 'next/image'
import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import { SubTitle } from '../ui/atoms/sub-title'
import Slider from '../slider'
import { GalleryCard } from '../gallery-card'
import { Paragraph } from '../ui/atoms/paragraph';

export const OthersSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 items-center py-8  ">

      <SubTitle className='text-center'>Dirigentes de la comuna bambil collao</SubTitle>
      <div className='flex-col md:flex-row w-full flex gap-4 items-center lg:py-16 lg:px-6 px-4 mx-auto max-w-screen-xl' >

        <div className="basis-1/2 py-12 w-full">
          <Image
            className="w-full h-[30dvh] rounded-3xl aspect-video md:aspect-auto object-cover"
            src="https://ik.imagekit.io/stevenrosales/app-comuna/image-1.jpg?updatedAt=1735495243684"
            alt="Dirigentes de la comuna bambil collao"
            width={600}
            height={400}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" className="px-6 py-3 font-bold text-center">Nombre</TableCell>
              <TableCell scope="col" className="px-6 py-3 font-bold text-center">Cargo</TableCell>
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
      <Slider
        delay={5500}
      >
        {
          Array.from({ length: 5 }).map((_, index) => (
            <>
              <GalleryCard key={index} />
              <Paragraph
                className='text-center'
              >
                Barrio {index + 1}
              </Paragraph>
            </>

          ))
        }

      </Slider>

    </section>
  )
}
