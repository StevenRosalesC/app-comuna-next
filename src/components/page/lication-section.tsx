'use client';
import { Mail, MapPin, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const address =
    'Santa Elena, Parroquia Colonche, Bambil Collao - Barrio 3 de Noviembre - Frente a la cancha de uso múltiple, Ecuador.';
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className='my-5 rounded-xl p-2'>
      <div className='flex h-full w-full flex-col items-end lg:flex-row'>
        <div
          className='flex basis-1/2 flex-col justify-between'
          data-aos='fade-up'
        >
          <div className='p-4'>
            <Mail size={32} aria-label='Icono correo' />
            <h4 className='text-xl font-bold'>Correo</h4>
            <p>Escríbenos a:</p>
            <Link
              className='font-semibold text-primary hover:underline'
              href='mailto:22defebrerobambil@gmail.com'
              aria-label='Enviar correo a la comuna'
            >
              22defebrerobambil@gmail.com
            </Link>
          </div>

          <div className='p-4'>
            <MapPin size={32} aria-label='Icono ubicación' />
            <h4 className='text-xl font-bold'>Oficina</h4>
            <p>{address}</p>
            <div className='mt-2 flex gap-2'>
              <button
                className='rounded bg-primary px-3 py-1 font-semibold text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary'
                onClick={() =>
                  window.open('https://goo.gl/maps/2Qn6Qn6Qn6Qn6Qn6A', '_blank')
                }
                aria-label='Abrir ubicación en Google Maps'
              >
                Ver en Google Maps
              </button>
              <button
                className='rounded border border-gray-400 px-3 py-1 font-semibold text-gray-700 shadow transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary'
                onClick={handleCopy}
                aria-label='Copiar dirección de la comuna'
              >
                <Copy
                  size={18}
                  className='mr-1 inline-block align-text-bottom'
                />
                {copied ? '¡Copiado!' : 'Copiar dirección'}
              </button>
            </div>
          </div>
        </div>
        <div
          className='min-h-full w-full basis-1/2 rounded-lg'
          data-aos='fade-up'
        >
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4845036976058!2d-80.65723262576253!3d-1.9598173980224185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902dd00ad3b3106d%3A0x18ff9cc5561eac86!2sBambil%20Collao!5e0!3m2!1ses-419!2sec!4v1698342874224!5m2!1ses-419!2sec'
            className='min-h-96 w-full rounded-lg border-0 shadow-md'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            aria-label='Mapa de ubicación de la comuna'
          ></iframe>
        </div>
      </div>
    </section>
  );
}
