'use client';
import { Mail, MapPin, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Paragraph } from '../ui/atoms/paragraph';
import { SubTitle } from '../ui/atoms/sub-title';

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
    <section
      id='location'
      className='mx-auto max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'
    >
      <div className='mx-auto mb-8 max-w-2xl text-center' data-aos='fade-up'>
        <SubTitle className='text-primary'>Cómo llegar y contacto</SubTitle>
        <Paragraph className='text-muted-foreground' size={'sm'}>
          Canales oficiales y ubicación para coordinar trámites o planificar tu
          visita.
        </Paragraph>
      </div>
      <div className='grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-5' data-aos='fade-up'>
          <div className='rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur dark:bg-background/40'>
            <div className='grid gap-4'>
              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                <div className='flex items-center gap-3'>
                  <Mail size={22} aria-label='Icono correo' />
                  <h4 className='text-lg font-bold'>Correo</h4>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Escríbenos a:
                </p>
                <Link
                  className='font-semibold text-primary hover:underline'
                  href='mailto:22defebrerobambil@gmail.com'
                  aria-label='Enviar correo a la comuna'
                >
                  22defebrerobambil@gmail.com
                </Link>
              </div>

              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                <div className='flex items-center gap-3'>
                  <MapPin size={22} aria-label='Icono ubicación' />
                  <h4 className='text-lg font-bold'>Oficina</h4>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>{address}</p>
                <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
                  <Button
                    className='w-full sm:w-auto'
                    onClick={() =>
                      window.open(
                        'https://goo.gl/maps/2Qn6Qn6Qn6Qn6Qn6A',
                        '_blank'
                      )
                    }
                    aria-label='Abrir ubicación en Google Maps'
                  >
                    Ver en Google Maps
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full sm:w-auto'
                    onClick={handleCopy}
                    aria-label='Copiar dirección de la comuna'
                  >
                    <Copy size={18} className='mr-1 inline-block' />
                    {copied ? '¡Copiado!' : 'Copiar dirección'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-7' data-aos='fade-up'>
          <div className='rounded-3xl border border-border/60 bg-background/70 p-3 shadow-sm backdrop-blur dark:bg-background/40 md:p-4'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4845036976058!2d-80.65723262576253!3d-1.9598173980224185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902dd00ad3b3106d%3A0x18ff9cc5561eac86!2sBambil%20Collao!5e0!3m2!1ses-419!2sec!4v1698342874224!5m2!1ses-419!2sec'
              className='min-h-96 w-full rounded-2xl border-0 shadow-sm'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              aria-label='Mapa de ubicación de la comuna'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
