'use client';
import Image from 'next/image';
import { Title } from '../ui/atoms/title';
import ReactAudioPlayer from 'react-audio-player';

export default function AboutView() {
  return (
    <>
      <Title className='w-full max-w-full text-center'>
        Acerca de la comuna Bambil Collao
      </Title>
      <div className='px-4 py-9 2xl:container md:px-6 md:py-12 lg:px-20 lg:py-16 2xl:mx-auto'>
        <section className='flex flex-col justify-between gap-8 lg:flex-row'>
          <div className='flex w-full flex-col justify-center lg:w-5/12'>
            <h2 className='pb-4 text-3xl font-bold leading-9 text-gray-800 lg:text-4xl'>
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
          <div className='w-full lg:w-8/12 '>
            <Image
              width={1920}
              height={1080}
              className='h-60 w-full rounded-lg object-cover lg:h-96'
              src='https://ik.imagekit.io/stevenrosales/app-comuna/bambil.jpg?updatedAt=1737682578946'
              alt='Bambil Collao'
            />
          </div>
        </section>

        <section className='flex flex-col justify-between gap-8 pt-12 lg:flex-row-reverse lg:pt-16'>
          <div className='flex w-full flex-col justify-center lg:w-5/12'>
            <h2 className='pb-4 text-3xl font-bold leading-9 text-gray-800 lg:text-4xl'>
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
          <div className='w-full lg:w-8/12 lg:pt-8'>
            <Image
              width={1920}
              height={1080}
              className='h-60 w-full rounded-lg object-cover lg:h-96'
              src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna2.jpg?updatedAt=1738503934177'
              alt='Bambil Collao 2'
            />
          </div>
        </section>
        <section className='mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16'>
          <div className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
            <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
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
            <ReactAudioPlayer
              src='https://ik.imagekit.io/stevenrosales/app-comuna/Himno.mpeg?updatedAt=1738526401950'
              controls
              className='background-transparent h-12 w-full'
            />
          </div>
          <div className='mt-8 grid grid-cols-2 gap-4'>
            <Image
              width={1920}
              height={1080}
              className='h-auto w-full rounded-lg object-cover lg:h-80'
              src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna3.jpg?updatedAt=1738504481302'
              alt='office content 1'
            />
            <Image
              width={1920}
              height={1080}
              className='mt-4 h-full w-full rounded-lg object-cover lg:mt-10'
              src='https://ik.imagekit.io/stevenrosales/app-comuna/descarga%20(1).png?updatedAt=1738505142037&tr=w-1200%2Ch-630%2Cfo-auto'
              alt='office content 2'
            />
          </div>
        </section>
      </div>
    </>
  );
}
