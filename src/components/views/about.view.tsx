import Image from 'next/image';
import { Title } from '../ui/atoms/title';

import Aos from '../aos';
import Himno from '../page/himno';
import HistorySection from '../page/history-section';

export default function AboutView() {
  return (
    <>
      <Aos duration={500} />
      <Title className='w-full max-w-full text-center'>
        Acerca de la comuna Bambil Collao
      </Title>
      <div className='px-4 py-9 2xl:container md:px-6 md:py-12 lg:px-20 lg:py-16 2xl:mx-auto'>
        <section className='flex flex-col justify-between gap-8 lg:flex-row'>
          <div
            className='flex w-full flex-col justify-center lg:w-5/12'
            data-aos='zoom-in-up'
          >
            <h2 className='pb-4 text-3xl font-bold leading-9 text-green-600 lg:text-4xl'>
              Misión
            </h2>
            <p className='text-base font-normal leading-6 text-gray-600 '>
              Nuestra misión es promover la colaboración y el bienestar dentro
              de nuestra comunidad, creando un ambiente inclusivo y solidario en
              el que todos los miembros puedan prosperar. Nos esforzamos por
              mejorar la calidad de vida de nuestros residentes, fomentando el
              respeto, la empatía y la igualdad.
            </p>
          </div>
          <div className='w-full lg:w-8/12 ' data-aos='zoom-in-up'>
            <Image
              width={1920}
              height={1080}
              className='h-60 w-full rounded-lg object-cover lg:h-96'
              src='/page/mision.webp'
              alt='mission comuna bambil collao'
            />
          </div>
        </section>

        <section className='flex flex-col justify-between gap-8 pt-12 lg:flex-row-reverse lg:pt-16'>
          <div
            className='flex w-full flex-col justify-center lg:w-5/12'
            data-aos='zoom-in-up'
          >
            <h2 className='pb-4 text-3xl font-bold leading-9 text-green-600 lg:text-4xl'>
              Vision
            </h2>
            <p className='text-base font-normal leading-6 text-gray-600 '>
              Nuestra visión es convertir a Bambil Collao en un refugio de
              armonía y sostenibilidad, donde los lazos entre los residentes y
              la naturaleza se fortalezcan con el tiempo. Buscamos crear un
              modelo de comunidad que inspire al mundo, promoviendo la
              coexistencia pacífica, la preservación ambiental y el bienestar de
              todos sus habitantes. Imaginamos un lugar donde las futuras
              generaciones prosperen en equilibrio con la Tierra, compartiendo
              historias bajo las estrellas y celebrando la riqueza de la vida en
              la montaña
            </p>
          </div>
          <div className='w-full lg:w-8/12 lg:pt-8' data-aos='zoom-in-up'>
            <Image
              width={1920}
              height={1080}
              className='h-60 w-full rounded-lg object-cover lg:h-96'
              src='/page/vision.webp'
              alt='vision comuna bambil collao'
            />
          </div>
        </section>
        <HistorySection />
        <section className='mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16'>
          <div
            className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'
            data-aos='zoom-in-up'
          >
            <h2 className='mb-4 text-4xl font-extrabold tracking-tight  text-green-600 dark:text-white'>
              Nuestro himno
            </h2>
            <p className='mb-4'>
              Escrito por :{' '}
              <span className='font-semibold'>
                Florencio Pilai Ramirez, Nelson Dario Mendez Tomalá
              </span>
            </p>
            <p className='mb-4'>
              Música por :{' '}
              <span className='font-semibold'>Florencio Pilay Ramirez</span>
            </p>
            <p className='mb-4'>Letra :</p>
            <p className='mb-4 text-center'>
              <span className='font-semibold'>Estrofa 1</span>
              <br />
              CON LA MANO EN EL PECHO ESTOY, <br />
              CANTANDO ESTE HIMNO A BAMBIL, <br />
              &quot;Y MIRANDO FLAMEAR LA BANDERA CON EL VIENTO Y EL SOL QUE LO
              ESMERA&quot;
            </p>
            <p className='mb-4 text-center'>
              <span className='font-semibold'>Estrofa 2</span>
              <br />
              DEL CALLAO QUE EXISTIÓ EN ESTE PUEBLO <br />
              AQUEL INDIO VALIENTE Y GUERRERO, <br />
              HEREDAMOS EN NUESTRAS VENAS <br />
              SANGRE DE NUESTROS ANTES PASADOS <br />
              EN SUS MANOS AQUELL INDIO GUERRERO <br />
              UNA LANZA DE PAMBIL LLEVABA <br />
              &quot;DEFENDIENDO SUS TIERRAS Y MUJERES EN LA LLEGADA DE LOS
              ESPAÑOLES&quot;
            </p>
            <p className='mb-4 text-center'>
              <span className='font-semibold'>Estrofa 3</span>
              <br />
              RIO GRANDE FERNANSANCHEZ SON <br />
              CAUDALES QUE ENCIERRAN A ESTE PUEBLO <br />
              DE GRANDES HOMBRES Y MUJERES HERMOSAS <br />
              SOBERANO DE NUESTRA NACIÓN <br />
              ADELANTE ADELANTE BAMBILINCE <br />
              QUE TRABAJA CON MUCHO AMOR <br />
              &quot;DE TRANSFORMAR ESTE PUEBLO HERMOSO EN PARROQUIA DE MI
              CANTÓN&quot;
            </p>
            <Himno />
          </div>
          <div className='mt-8 grid grid-cols-2 gap-4' data-aos='zoom-in-up'>
            <Image
              width={1920}
              height={1080}
              className='h-auto w-full rounded-lg object-cover lg:h-80'
              src='/page/church.webp'
              alt='iglesia de bambil collao'
            />
            <Image
              width={1920}
              height={1080}
              className='mt-4 h-full w-full rounded-lg object-cover lg:mt-10'
              src='/page/himno-1.webp'
              alt='imagen del himno de bambil collao'
            />
          </div>
        </section>
      </div>
    </>
  );
}
