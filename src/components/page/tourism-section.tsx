import { Landmark, Leaf, Mountain, Users } from 'lucide-react';
import Link from 'next/link';
import { Paragraph } from '../ui/atoms/paragraph';
import { SubTitle } from '../ui/atoms/sub-title';

export default function TourismSection() {
  const items = [
    {
      title: 'Patrimonio y tradición',
      description:
        'Conoce la historia, costumbres y valores que dan identidad a nuestra comuna.',
      icon: <Landmark className='h-5 w-5 text-primary' aria-hidden='true' />,
      href: '/about'
    },
    {
      title: 'Naturaleza y paisaje',
      description:
        'Disfruta de recorridos y entornos rurales que conectan con la vida comunitaria.',
      icon: <Leaf className='h-5 w-5 text-primary' aria-hidden='true' />,
      href: '/about'
    },
    {
      title: 'Turismo comunitario',
      description:
        'Explora experiencias locales con respeto, organización y participación responsable.',
      icon: <Users className='h-5 w-5 text-primary' aria-hidden='true' />,
      href: '/contact'
    },
    {
      title: 'Cómo llegar',
      description:
        'Ubicación, contacto y mapa para planificar tu visita a Bambil Collao.',
      icon: <Mountain className='h-5 w-5 text-primary' aria-hidden='true' />,
      href: '/#location'
    }
  ];

  return (
    <section
      className='mx-auto max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'
      aria-label='Sección turística e institucional'
    >
      <div className='grid gap-6 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-10'>
        <div className='mx-auto max-w-2xl text-center'>
          <SubTitle className='text-primary'>
            Institución, territorio y turismo
          </SubTitle>
          <Paragraph className='text-muted-foreground' size={'sm'}>
            Información institucional y una mirada a lo que hace única a la
            Comuna Bambil Collao para residentes y visitantes.
          </Paragraph>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map((item) =>
            item.href ? (
              <Link
                key={item.title}
                href={item.href}
                className='rounded-2xl border bg-white/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
              >
                <div className='flex items-center gap-2'>
                  {item.icon}
                  <p className='font-semibold'>{item.title}</p>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {item.description}
                </p>
              </Link>
            ) : (
              <div
                key={item.title}
                className='rounded-2xl border bg-white/60 p-5 shadow-sm'
              >
                <div className='flex items-center gap-2'>
                  {item.icon}
                  <p className='font-semibold'>{item.title}</p>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {item.description}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
