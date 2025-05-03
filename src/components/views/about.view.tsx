import Image from 'next/image';
import { Title } from '../ui/atoms/title';
import Aos from '../aos';
import Himno from '../page/himno';
import HistorySection from '../page/history-section';
import { Users, Award, Star, HeartHandshake } from 'lucide-react';

// {
//   "@context": "https://schema.org/",
//     "@type": "Article",
//       "name": "Apple announces iPhone SE",
//         "description": "New iPhone announced at 11:30 in California.",
//           "about": {
//     "@type": "Event",
//       "name": "Apple's March 21 Announcements"
//   },
//   "contentReferenceTime": "2016-03-21T11:30:00-07:00"
// }

export default function AboutView() {
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'Comuna Bambil Collao',
    description:
      'Información sobre la comuna Bambil Collao, su historia, misión, visión, valores, equipo y logros.',
    url: `https://${process.env.NEXT_PUBLIC_APP_URL}`,
    logo: `https://${process.env.NEXT_PUBLIC_APP_URL}/icon.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Barrio 3 de Noviembre - Frente a la cancha de uso múltiple',
      addressLocality: 'Bambil Collao',
      addressRegion: 'Santa Elena',
      addressCountry: 'EC'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: '22defebrerobambil@gmail.com',
      telephone: '+593 99 999 9999',
      contactType: 'Información general'
    },
    member: [
      {
        '@type': 'Person',
        name: 'Juan Pérez',
        jobTitle: 'Presidente',
        image: '/team/presidente.webp'
      },
      {
        '@type': 'Person',
        name: 'María García',
        jobTitle: 'Secretaria',
        image: '/team/secretaria.webp'
      }
    ]
  };

  const valores = [
    { icon: <HeartHandshake className="text-green-600" size={32} />, label: 'Solidaridad', desc: 'Apoyamos y cuidamos a todos los miembros de la comunidad.' },
    { icon: <Star className="text-yellow-500" size={32} />, label: 'Excelencia', desc: 'Buscamos la mejora continua en todo lo que hacemos.' },
    { icon: <Award className="text-blue-600" size={32} />, label: 'Respeto', desc: 'Valoramos la diversidad y fomentamos el trato digno.' },
    { icon: <Users className="text-purple-600" size={32} />, label: 'Colaboración', desc: 'Trabajamos juntos para lograr objetivos comunes.' }
  ];

  // const equipo = [
  //   { nombre: 'Juan Pérez', rol: 'Presidente', img: '/team/presidente.webp' },
  //   { nombre: 'María García', rol: 'Secretaria', img: '/team/secretaria.webp' },
  //   { nombre: 'Carlos López', rol: 'Tesorero', img: '/team/tesorero.webp' }
  // ];

  // const logros = [
  //   { icon: <Award className="text-green-600" size={28} />, titulo: 'Reconocimiento Provincial', desc: 'Premio a la mejor gestión comunitaria 2023.' },
  //   { icon: <Star className="text-yellow-500" size={28} />, titulo: '100+ Comuneros', desc: 'Superamos los 100 comuneros activos en 2024.' },
  //   { icon: <Users className="text-blue-600" size={28} />, titulo: 'Nuevas asociaciones', desc: 'Formación de 3 nuevas asociaciones en la comuna.' }
  // ];

  // const testimonios = [
  //   { nombre: 'Ana Torres', texto: 'Ser parte de la comuna ha cambiado mi vida. Aquí todos nos apoyamos.' },
  //   { nombre: 'Luis Mendoza', texto: 'Gracias a la gestión, mi familia tiene mejores oportunidades.' }
  // ];

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Aos duration={500} />
      <Title className='w-full max-w-full text-center'>
        Acerca de la comuna Bambil Collao
      </Title>
      <div className='px-4 py-9 2xl:container md:px-6 md:py-12 lg:px-20 lg:py-16 2xl:mx-auto'>
        {/* Misión */}
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
              alt='Misión de la comuna Bambil Collao'
              loading='lazy'
            />
          </div>
        </section>

        {/* Visión */}
        <section className='flex flex-col justify-between gap-8 pt-12 lg:flex-row-reverse lg:pt-16'>
          <div
            className='flex w-full flex-col justify-center lg:w-5/12'
            data-aos='zoom-in-up'
          >
            <h2 className='pb-4 text-3xl font-bold leading-9 text-green-600 lg:text-4xl'>
              Visión
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
              alt='Visión de la comuna Bambil Collao'
              loading='lazy'
            />
          </div>
        </section>

        {/* Valores */}
        <section className='py-12'>
          <h2 className='mb-8 text-3xl font-bold text-center text-green-600'>Valores</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {valores.map((valor, idx) => (
              <div key={idx} className='flex flex-col items-center p-6 bg-white rounded-lg shadow-md animate-fade-in-card' tabIndex={0} aria-label={valor.label}>
                {valor.icon}
                <h3 className='mt-2 text-xl font-semibold'>{valor.label}</h3>
                <p className='text-gray-600 text-center'>{valor.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        {/* <section className='py-12'>
          <h2 className='mb-8 text-3xl font-bold text-center text-green-600'>Equipo directivo</h2>
          <div className='flex flex-wrap justify-center gap-8'>
            {equipo.map((persona, idx) => (
              <div key={idx} className='flex flex-col items-center bg-white p-4 rounded-lg shadow-md animate-fade-in-card' tabIndex={0} aria-label={persona.nombre}>
                <Image
                  src={persona.img}
                  alt={`Foto de ${persona.nombre}`}
                  width={120}
                  height={120}
                  className='rounded-full object-cover mb-2 border-4 border-green-200 shadow'
                  loading='lazy'
                />
                <h3 className='text-lg font-bold'>{persona.nombre}</h3>
                <span className='text-green-700 font-semibold'>{persona.rol}</span>
              </div>
            ))}
          </div>
        </section> */}

        {/* Logros */}
        {/* <section className='py-12'>
          <h2 className='mb-8 text-3xl font-bold text-center text-green-600'>Logros y reconocimientos</h2>
          <div className='flex flex-wrap justify-center gap-8'>
            {logros.map((logro, idx) => (
              <div key={idx} className='flex flex-col items-center bg-white p-4 rounded-lg shadow-md animate-fade-in-card' tabIndex={0} aria-label={logro.titulo}>
                {logro.icon}
                <h3 className='text-lg font-bold mt-2'>{logro.titulo}</h3>
                <p className='text-gray-600 text-center'>{logro.desc}</p>
              </div>
            ))}
          </div>
        </section> */}

        <HistorySection />

        {/* Testimonios */}
        {/* <section className='py-12'>
          <h2 className='mb-8 text-3xl font-bold text-center text-green-600'>Testimonios</h2>
          <div className='flex flex-wrap justify-center gap-8'>
            {testimonios.map((testi, idx) => (
              <div key={idx} className='max-w-md bg-white p-6 rounded-lg shadow-md animate-fade-in-card' tabIndex={0} aria-label={`Testimonio de ${testi.nombre}`}>
                <p className='italic text-gray-700 mb-2'>&quot;{testi.texto}&quot;</p>
                <span className='block text-right text-green-700 font-semibold'>- {testi.nombre}</span>
              </div>
            ))}
          </div>
        </section> */}

        {/* Himno y galería */}
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
              loading='lazy'
            />
            <Image
              width={1920}
              height={1080}
              className='mt-4 h-full w-full rounded-lg object-cover lg:mt-10'
              src='/page/himno-1.webp'
              alt='imagen del himno de bambil collao'
              loading='lazy'
            />
          </div>
        </section>
      </div>
    </>
  );
}
