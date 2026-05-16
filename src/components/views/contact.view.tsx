'use client';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Clock, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { sendContactMessage } from '@/services/contact';
import { Title } from '../ui/atoms/title';
import { Paragraph } from '../ui/atoms/paragraph';
import { SubTitle } from '../ui/atoms/sub-title';

const contactSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'El nombre es requerido'
    }),
  email: z.string().email({
    message: 'El correo no es valido'
  }),
  message: z.string().min(10, {
    message: 'El mensaje es requerido'
  })
});

export default function ContactView() {
  const [copied, setCopied] = useState(false);
  const address =
    'Santa Elena, Parroquia Colonche, Bambil Collao - Barrio 3 de Noviembre - Frente a la cancha de uso múltiple, Ecuador.';
  const officeHours = 'Lunes a viernes • 08:00 a 16:00';

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const {
    formState: { isSubmitting }
  } = form;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  async function onSubmit(data: z.infer<typeof contactSchema>) {
    try {
      await sendContactMessage(data);
      toast.success('¡Mensaje enviado con éxito!', {
        description: 'Gracias por contactarnos. Te responderemos pronto.'
      });
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    }
  }

  return (
    <section className='mx-auto w-full max-w-screen-xl px-4 py-10 lg:px-6 lg:py-16'>
      <div
        className='relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur dark:bg-background/40 md:p-10'
        data-aos='fade-up'
      >
        <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_20%_0%,hsl(var(--primary)/0.18)_0%,transparent_55%),radial-gradient(70%_60%_at_90%_20%,hsl(var(--primary)/0.10)_0%,transparent_60%)]' />
        <div className='grid items-start gap-10 lg:grid-cols-12'>
          <div className='lg:col-span-7'>
            <div className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground dark:bg-background/50'>
              <MapPin className='h-4 w-4 text-primary' aria-hidden='true' />
              Atención e información oficial
            </div>
            <Title className='mt-4'>Contacto institucional</Title>
            <Paragraph className='max-w-2xl text-muted-foreground' size={'sm'}>
              Canales oficiales para comunicación, coordinación de trámites y
              orientación para visitantes.
            </Paragraph>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                    <Mail className='h-5 w-5 text-primary-foreground' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold'>Email</p>
                    <a
                      href='mailto:22defebrerobambil@gmail.com'
                      className='block truncate text-sm text-muted-foreground hover:underline'
                      title='22defebrerobambil@gmail.com'
                    >
                      22defebrerobambil@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                    <Phone className='h-5 w-5 text-primary-foreground' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold'>Teléfono</p>
                    <a
                      className='mt-0.5 block whitespace-nowrap text-sm text-muted-foreground hover:underline'
                      href='tel:+593912345678'
                      title='(+593) 9 1234 5678'
                    >
                      (+593) 9 1234 5678
                    </a>
                  </div>
                </div>
              </div>
              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30 sm:col-span-2'>
                <div className='flex items-start gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                    <MapPin className='h-5 w-5 text-primary-foreground' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold'>Dirección</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {address}
                    </p>
                  </div>
                </div>
              </div>
              <div className='rounded-2xl border border-border/60 bg-background/60 p-4 dark:bg-background/30 sm:col-span-2'>
                <div className='flex items-start gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                    <Clock className='h-5 w-5 text-primary-foreground' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold'>Horario referencial</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {officeHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-2 sm:flex-row'>
              <Button
                onClick={() =>
                  window.open('https://goo.gl/maps/2Qn6Qn6Qn6Qn6Qn6A', '_blank')
                }
                aria-label='Abrir ubicación en Google Maps'
              >
                Ver en Google Maps
              </Button>
              <Button
                variant='outline'
                onClick={handleCopy}
                aria-label='Copiar dirección'
              >
                <Copy className='h-4 w-4' aria-hidden='true' />
                {copied ? '¡Copiado!' : 'Copiar dirección'}
              </Button>
            </div>
          </div>

          <div className='lg:col-span-5'>
            <div className='relative aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-sm'>
              <Image
                fill
                src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna4.jpg?updatedAt=1738512506714'
                alt='Imagen de la comuna'
                className='object-cover'
                sizes='(min-width: 1024px) 40vw, 100vw'
                priority
              />
            </div>
            <div className='mt-4 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur dark:bg-background/40'>
              <SubTitle className='mb-2 text-primary'>Visita la comuna</SubTitle>
              <p className='text-sm text-muted-foreground'>
                Encuentra el mapa, rutas y referencias para planificar tu visita
                con facilidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-7' data-aos='fade-up'>
          <Card className='rounded-3xl border border-border/60 bg-background/70 shadow-sm backdrop-blur dark:bg-background/40'>
            <CardHeader>
              <CardTitle>Enviar un mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos por los canales
                oficiales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className='space-y-4'
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              type='text'
                              {...field}
                              placeholder='Tu nombre'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              {...field}
                              placeholder='tu@correo.com'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={7}
                            placeholder='Escribe tu mensaje aquí...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' disabled={isSubmitting} className='w-full'>
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-5' data-aos='fade-up'>
          <div className='rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur dark:bg-background/40 md:p-5'>
            <SubTitle className='mb-2 text-primary'>Mapa</SubTitle>
            <p className='mb-4 text-sm text-muted-foreground'>
              Ubicación referencial para coordinar visitas y orientación.
            </p>
            <iframe
              title='Mapa de ubicación de la comuna'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4845036976058!2d-80.65723262576253!3d-1.9598173980224185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902dd00ad3b3106d%3A0x18ff9cc5561eac86!2sBambil%20Collao!5e0!3m2!1ses-419!2sec!4v1698342874224!5m2!1ses-419!2sec'
              className='min-h-96 w-full rounded-2xl border-0 shadow-sm'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
