import FaqSection from '@/components/page/faq-section';
import { HeroSection } from '@/components/page/hero-section';
import { NoticesSection } from '@/components/page/notices-section';
import { OthersSection } from '@/components/page/others-section';

export default function page() {
  return (
    <>
      <HeroSection />
      <NoticesSection />
      <OthersSection />
      {/* <FaqSection /> */}
      <section className='my-5 rounded-xl bg-white p-2'>
        <h2 className='text-center text-3xl font-bold'>UBICACIÓN</h2>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4845036976058!2d-80.65723262576253!3d-1.9598173980224185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902dd00ad3b3106d%3A0x18ff9cc5561eac86!2sBambil%20Collao!5e0!3m2!1ses-419!2sec!4v1698342874224!5m2!1ses-419!2sec'
          className='h-96 w-full border-0'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </section>
    </>
  );
}
