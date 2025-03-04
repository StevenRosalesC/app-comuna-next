import { Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function LocationSection() {
  return (
    <section className='my-5 rounded-xl p-2'>
      <div className='flex h-full w-full flex-col items-end lg:flex-row'>
        <div
          className='flex basis-1/2 flex-col justify-between'
          data-aos='fade-up'
        >
          <div className='p-4'>
            <Mail size={32} />
            <p className='text-xl font-bold'>Correo</p>
            <p>Escribenos a:</p>
            <Link
              className='hover:underline'
              href='mailto:22defebrerobambil@gmail.com'
            >
              22defebrerobambil@gmail.com
            </Link>
          </div>

          <div className='p-4'>
            <MapPin size={32} />
            <p className='text-xl font-bold'>Oficina</p>
            <p>
              Santa Elena, Parroquia Colonche, Bambil Collao - Barrio 3 de
              Noviembre - Frente a la cancha de uso múltiple, Ecuador.
            </p>
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
          ></iframe>
        </div>
      </div>
    </section>
  );
}
