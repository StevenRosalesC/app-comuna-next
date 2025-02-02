"use client";
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const contactSchema = z.object({
  personName: z.string({
    required_error: 'El nombre es requerido'
  }).min(3, {
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
      personName: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    console.log(data);
  }

  return (
    <section className='mx-auto grid max-w-screen-xl grid-cols-1 gap-8 rounded-lg px-8 py-16 dark:bg-gray-100 dark:text-gray-800 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32'>
      <div className='flex flex-col justify-between'>
        <div className='space-y-2'>
          <h2 className='text-4xl font-bold leading-tight lg:text-5xl'>
            Contactanos
          </h2>
          <div className='dark:text-gray-600'>
            Habla con nosotros, estamos aquí para ayudarte.
          </div>
        </div>
        <Image
          width={1080}
          height={720}
          src='https://ik.imagekit.io/stevenrosales/app-comuna/comuna4.jpg?updatedAt=1738512506714'
          alt=''
          className='h-full w-full object-cover rounded-lg shadow-md'
        />
      </div>
      <Form {...form} >

        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='personName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    {...field}
                    className='w-full rounded p-3 dark:bg-gray-100'
                  />
                </FormControl>
                <FormDescription>
                  Ingrese su nombre
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Correo
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    {...field}
                    className='w-full rounded p-3 dark:bg-gray-100'
                  />
                </FormControl>
                <FormDescription>
                  Ingrese su correo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mensaje
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    className='w-full rounded p-3 dark:bg-gray-100'
                  ></Textarea>
                </FormControl>
                <FormDescription>
                  Dejanos tu mensaje
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full rounded p-3 text-sm font-bold uppercase tracking-wide dark:bg-violet-600 dark:text-gray-50'
          >
            Enviar mensaje
          </Button>
        </form>
      </Form>
    </section>
  );
}
