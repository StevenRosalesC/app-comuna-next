import Image from 'next/image';

type GalleryCardProps = {
  images?: string[]; // Lista opcional de imágenes
};

export const GalleryCard = ({ images }: GalleryCardProps) => {
  // Si no se pasan imágenes, usa un marcador de posición por defecto
  const placeholderImages = Array.from({ length: 9 }).map(
    (_, index) => `/not-found.webp`
  );

  const galleryImages = images?.length ? images : placeholderImages;

  return (
    <div className="w-full h-full p-4 mb-10 bg-gray-100 dark:bg-gray-800 rounded-lg grid grid-cols-3 gap-2">
      {galleryImages.map((src, index) => (
        <div
          key={index}
          className="relative w-full h-24 overflow-hidden rounded-lg"
        >
          <Image
            src={src}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover aspect-video"
          />
        </div>
      ))}
    </div>
  );
};
