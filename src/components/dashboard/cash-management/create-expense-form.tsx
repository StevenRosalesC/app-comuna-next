'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { CreateExpenseDto } from '@/interfaces/cash-register';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrendingDown, DollarSign, FileText, Calendar, Tag, Loader2, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  expenseDate: z.string().min(1, 'La fecha es requerida'),
  expense_code: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface CreateExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateExpenseForm({ onSuccess, onCancel }: CreateExpenseFormProps) {
  const queryClient = useQueryClient();

  const { data: activeRegister, isLoading: loadingRegister } = useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActiveRegister
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      expense_code: undefined
    }
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseDto) => cashRegisterService.createExpense(data),
    onSuccess: () => {
      toast.success('Gasto registrado exitosamente en la caja activa');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al registrar el gasto');
    }
  });

  const onSubmit = (values: FormValues) => {
    if (!activeRegister) {
      toast.error('No hay una caja registradora abierta');
      return;
    }

    createExpenseMutation.mutate({
      ...values,
      cashRegisterId: Number(activeRegister.cashRegisterId)
    });
  };

  if (loadingRegister) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!activeRegister) {
    return (
      <div className='flex flex-col items-center justify-center p-6 text-center space-y-3'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600'>
          <AlertCircle className='h-6 w-6' />
        </div>
        <div>
          <h4 className='font-semibold text-base'>Caja Cerrada</h4>
          <p className='text-xs text-muted-foreground max-w-xs mt-1'>
            Debes abrir una caja antes de poder registrar gastos o egresos en efectivo.
          </p>
        </div>
        {onCancel && (
          <Button variant='outline' size='sm' onClick={onCancel} className='mt-2'>
            Cerrar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between rounded-xl border bg-rose-500/5 p-3 text-xs'>
        <div className='flex items-center gap-2'>
          <TrendingDown className='h-4 w-4 text-rose-600 dark:text-rose-400' />
          <span className='font-medium text-foreground'>
            Caja Activa: {activeRegister.cashRegisterName || `Caja #${activeRegister.cashRegisterId}`}
          </span>
        </div>
        <Badge variant='outline' className='border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-[10px]'>
          Abierta
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-semibold'>
                  Monto del Gasto ($) <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='0.00'
                      className='pl-9 font-semibold text-base'
                      autoFocus
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-semibold'>
                  Descripción / Motivo <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <FileText className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Textarea
                      placeholder='Detalle del gasto, insumos, compras o egreso en efectivo...'
                      className='pl-9 min-h-[80px] text-xs'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='expenseDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold'>Fecha del Gasto</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <Input type='date' className='pl-9 text-xs' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='expense_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold'>Código de Categoría</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <Input
                        type='number'
                        placeholder='Opcional'
                        className='pl-9 text-xs'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? undefined : parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex items-center justify-end gap-2 pt-3 border-t'>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel} disabled={createExpenseMutation.isPending}>
                Cancelar
              </Button>
            )}
            <Button
              type='submit'
              disabled={createExpenseMutation.isPending}
              className='bg-rose-600 hover:bg-rose-700 text-white'
            >
              {createExpenseMutation.isPending ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <TrendingDown className='mr-2 size-4' />
              )}
              Registrar Gasto
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}