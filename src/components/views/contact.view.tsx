'use client';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, MapPin, Phone } from 'lucide-react';

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

const contactSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido'
    })
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
    <section className='w-full py-12'>
      <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
        {/* Left Column: Info & Image */}
        <div className='space-y-6'>
          <div className='space-y-3'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Ponte en Contacto
            </h2>
            <p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              ¿Tienes alguna pregunta o comentario? Completa el formulario y nos
              pondremos en contacto contigo lo antes posible.
            </p>
          </div>
          <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
            <Image
              fill
              src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna4.jpg?updatedAt=1738512506714'
              alt='Imagen de la comuna'
              className='object-cover'
            />
          </div>
        </div>

        {/* Right Column: Form & Details */}
        <div className='space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle>Enviar un mensaje</CardTitle>
              <CardDescription>
                Nos encantaría saber de ti. Envíanos tu mensaje aquí.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className='space-y-4'
                  onSubmit={form.handleSubmit(onSubmit)}
                >
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
                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder='Escribe tu mensaje aquí...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full'
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className='space-y-4 text-sm'>
            <div className='flex items-center gap-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <Mail className='h-5 w-5 text-primary-foreground' />
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold'>Email</span>
                <a
                  href='mailto:info@comunabambil.com'
                  className='text-muted-foreground hover:underline'
                >
                  info@comunabambil.com
                </a>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <Phone className='h-5 w-5 text-primary-foreground' />
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold'>Teléfono</span>
                <span className='text-muted-foreground'>
                  (+593) 9 1234 5678
                </span>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <MapPin className='h-5 w-5 text-primary-foreground' />
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold'>Ubicación</span>
                <span className='text-muted-foreground'>
                  Bambil Collao, Santa Elena, Ecuador
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
