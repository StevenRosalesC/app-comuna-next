'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import { useEffect } from 'react';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordPageProps {
  params: { token: string };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      console.log({ token, password: data.password });
      const response = await AuthService.resetPassword(token, {
        newPassword: data.password
      });
      console.log(response);
      toast.success('Contraseña restablecida');
      router.push('/auth/login');
    } catch (error) {
      console.log(error);
      toast.error('Error al restablecer la contraseña');
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await AuthService.validateToken(token);
        console.log(response);
        if (response.status === 200) {
          toast.success('Token valido');
        } else {
          toast.error('Token invalido');
          router.push('/auth/forgot-password');
        }
      } catch (error) {
        toast.error('Error al validar el token');
        router.push('/auth/forgot-password');
      }
    };
    validateToken();
  }, [router, token]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Card className='shadow-card-dark w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold text-primary'>
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter new password'
                        {...field}
                        className='bg-secondary focus:bg-background'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm new password'
                        {...field}
                        className='bg-secondary focus:bg-background'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
              >
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
