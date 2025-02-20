import FaqSection from '@/components/page/faq-section';
// import { HeroSection } from '@/components/page/hero-section';
// import { NoticesSection } from '@/components/page/notices-section';
import { OthersSection } from '@/components/page/others-section';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// dynamic import for better performance
const HeroSection = dynamic(() => import('@/components/page/hero-section'));
const NoticesSection = dynamic(() => import('@/components/page/notices-section'));

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description:
    'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  category: 'Inicio',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/`,
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `${NEXT_PUBLIC_APP_URL}/`
  }
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoticesSection />
      <OthersSection />
      <FaqSection />
      {/* <FaqSection /> */}
      <section className='my-5 rounded-xl bg-white p-2'>
        <div className='flex h-full w-full flex-col items-center lg:flex-row'>
          <div className='flex basis-1/2 flex-col justify-between'>
            <div className='p-4'>
              <Mail size={32} />
              <p className='text-xl font-bold'>Correo</p>
              <p>Escribenos a:</p>
              <a href='mailto:comuna@gmail.com'>comuna@gmail.com</a>
            </div>
            <div className='p-4'>
              <Phone size={32} />
              <p className='text-xl font-bold'>Telefono</p>
              <p>Llamanos para más información:</p>
              <a href='tel:+593987654321'>+593 987654321</a>
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
          <div className='min-h-full w-full basis-1/2'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4845036976058!2d-80.65723262576253!3d-1.9598173980224185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902dd00ad3b3106d%3A0x18ff9cc5561eac86!2sBambil%20Collao!5e0!3m2!1ses-419!2sec!4v1698342874224!5m2!1ses-419!2sec'
              className='min-h-96 w-full border-0 '
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
