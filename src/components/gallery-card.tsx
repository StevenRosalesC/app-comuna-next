import Image from 'next/image';
import React from 'react';

type GalleryCardProps = {
  images?: string[];
  alt?: string;
};

export const GalleryCard = ({ images, alt }: GalleryCardProps) => {
  // Si no se pasan imágenes, usa un marcador de posición por defecto
  const placeholderImages = Array.from({ length: 9 }).map(
    (_, index) => `/not-found.webp`
  );

  const galleryImages = images?.length ? images : placeholderImages;

  return (
    <>
      <div className='mb-10 grid h-full w-full grid-cols-3 gap-2 rounded-lg bg-gray-100 p-4'>
        {galleryImages.map((src, index) => (
          <div
            key={`gallery-${alt}-${index}`}
            className='relative h-24 w-full overflow-hidden rounded-lg'
          >
            <Image
              src={src}
              alt={`${alt}-${index}`}
              fill
              className='aspect-video object-cover'
            />
          </div>
        ))}
      </div>
    </>
  );
};
