'use client';
import React from 'react'
import { Paragraph } from '../ui/atoms/paragraph'
import Link from 'next/link'
import { Button } from '../ui/button'
import * as z from 'zod'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  isTermsAccepted: z.boolean().refine(value => value === true, { message: 'You must accept the terms and conditions' })
});

type UserFormValue = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const defaultValues = {
    email: '',
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    console.log(data);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Comuna Bambil Collao
        </a>
        <div className="w-full p-6 bg-white rounded-lg  shadow dark:border  dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            ¿Olvidaste tu contraseña?
          </h1>
          <Paragraph size={'sm'}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Paragraph>
          <Form {...form}>

            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Input {...field} type="email" placeholder=""

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Input aria-describedby="terms" type="checkbox"
                    {...form.register('isTermsAccepted')}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                    Acepto los
                    <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                      términos y condiciones
                    </a></label>
                </div>
              </div>
              <Button type="submit" className="w-full  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                Restablecer contraseña
              </Button>
              <FormMessage />
            </form>
          </Form>

          <Link href="/auth/login" className="block mt-4 text-sm text-primary-600 hover:underline dark:text-primary-500">
            ¿Recuerdas tu contraseña? Inicia sesión
          </Link>
        </div>
      </div>
    </section>
  )
}
