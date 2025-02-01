'use client';
import React from 'react';
import { Paragraph } from '../ui/atoms/paragraph';
import Link from 'next/link';
import { Button } from '../ui/button';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  isTermsAccepted: z
    .boolean()
    .refine((value) => value === true, {
      message: 'You must accept the terms and conditions'
    })
});

type UserFormValue = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const defaultValues = {
    email: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: UserFormValue) => {
    try {
      setIsLoading(true);
      // API call here
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center'>
        <a
          href='#'
          className='mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white'
        >
          Comuna Bambil Collao
        </a>
        <div className='w-full rounded-lg bg-white p-6  shadow dark:border  dark:border-gray-700 dark:bg-gray-800 sm:p-8'>
          <h1 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
            ¿Olvidaste tu contraseña?
          </h1>
          <Paragraph size={'sm'}>
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </Paragraph>
          <Form {...form}>
            <form
              className='mt-4 space-y-4 md:space-y-5 lg:mt-5'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Correo electrónico
                </label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" /> */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' placeholder='' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-start'>
                <div className='flex h-5 items-center'>
                  <Input
                    aria-describedby='terms'
                    type='checkbox'
                    {...form.register('isTermsAccepted')}
                    className='focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label
                    htmlFor='terms'
                    className='font-light text-gray-500 dark:text-gray-300'
                  >
                    Acepto los
                    <a
                      className='text-primary-600 dark:text-primary-500 font-medium hover:underline'
                      href='#'
                    >
                      términos y condiciones
                    </a>
                  </label>
                </div>
              </div>
              <Button
                type='submit'
                className='w-full  rounded-lg px-5 py-2.5 text-center text-sm font-medium '
              >
                Restablecer contraseña
              </Button>
              <FormMessage />
            </form>
          </Form>

          <Link
            href='/auth/login'
            className='text-primary-600 dark:text-primary-500 mt-4 block text-sm hover:underline'
          >
            ¿Recuerdas tu contraseña? Inicia sesión
          </Link>
        </div>
      </div>
    </section>
  );
};
