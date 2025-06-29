'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cash-register';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { AxiosError } from 'axios';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  initialAmount: z.coerce
    .number()
    .min(0, 'El monto inicial no puede ser negativo.'),
  notes: z.string().optional()
});

export default function OpenCashRegister({
  canOpenCashRegister = false
}: {
  canOpenCashRegister?: boolean;
}) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 0,
      notes: ''
    }
  });

  const openRegisterMutation = useMutation({
    mutationFn: cashRegisterService.openRegister,
    onSuccess: () => {
      toast.success('Caja abierta correctamente.');
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Error al abrir la caja.');
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    openRegisterMutation.mutate(values);
  };

  // If user doesn't have permission to open cash register, show access denied
  if (!canOpenCashRegister) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes permisos para abrir una nueva caja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Contacta al administrador para obtener los permisos necesarios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abrir Nueva Caja</CardTitle>
        <CardDescription>
          No hay ninguna caja abierta. Para empezar a registrar pagos, por favor
          abre una nueva caja con un monto inicial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='initialAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Inicial ($)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Añade una nota sobre la apertura...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={openRegisterMutation.isPending}>
              {openRegisterMutation.isPending ? 'Abriendo...' : 'Abrir Caja'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
