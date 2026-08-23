'use client';

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
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import {
  DollarSign,
  Sparkles,
  FileText,
  Loader2,
  ShieldCheck,
  Receipt,
  Info,
  LockOpen,
  Coins,
  ShieldAlert,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getDefaultCashRegisterName = () => {
  return `Caja ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`;
};

const formSchema = z.object({
  cashRegisterName: z.string().optional(),
  initialAmount: z.number().min(0, 'El monto inicial no puede ser negativo.'),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const QUICK_AMOUNTS = [0, 20, 50, 100];

export default function OpenCashRegister({
  canOpenCashRegister = false,
  onSuccess
}: {
  canOpenCashRegister?: boolean;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cashRegisterName: getDefaultCashRegisterName(),
      initialAmount: 0,
      notes: ''
    }
  });

  const openRegisterMutation = useMutation({
    mutationFn: (values: FormValues) =>
      cashRegisterService.openRegister({
        ...values,
        cashRegisterName: values.cashRegisterName?.trim() || getDefaultCashRegisterName()
      }),
    onSuccess: () => {
      toast.success('Caja abierta y sesión de cobros iniciada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      form.reset({
        cashRegisterName: getDefaultCashRegisterName(),
        initialAmount: 0,
        notes: ''
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al abrir la caja.');
    }
  });

  const onSubmit = (values: FormValues) => {
    openRegisterMutation.mutate(values);
  };

  if (!canOpenCashRegister) {
    return (
      <Card className='border-destructive/30 bg-destructive/5'>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive'>
              <ShieldAlert className='h-5 w-5' />
            </div>
            <div>
              <CardTitle className='text-base text-destructive'>Acceso Denegado</CardTitle>
              <CardDescription className='text-xs'>
                No tienes privilegios para abrir una nueva sesión de caja.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-xs text-muted-foreground'>
            Contacta a un administrador con rol autorizado para proceder con la apertura.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-12 items-start'>
      {/* Left Column: Open Cash Register Form (7 cols) */}
      <Card className='lg:col-span-7 border shadow-sm overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-primary/5'>
          <div className='flex items-center gap-3.5'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs'>
              <Sparkles className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg font-bold tracking-tight'>
                  Apertura de Caja
                </CardTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-primary/30 text-primary bg-primary/10'
                >
                  Nueva Sesión
                </Badge>
              </div>
              <CardDescription className='text-xs text-muted-foreground'>
                Inicia una nueva jornada de caja para habilitar el registro de cobros y facturas.
              </CardDescription>
            </div>
          </div>
        </div>

        <CardContent className='p-6 space-y-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Cash Register Name Input */}
              <FormField
                control={form.control}
                name='cashRegisterName'
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-semibold text-foreground'>
                        Nombre / Identificador de Caja
                      </FormLabel>
                      <span className='text-[11px] text-muted-foreground'>
                        Opcional (se autogenera)
                      </span>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <Tag className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                          placeholder='Ej: Caja 22/08/2026 15:45'
                          className='pl-10 text-xs font-medium h-9'
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          disabled={openRegisterMutation.isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Initial Amount Input */}
              <FormField
                control={form.control}
                name='initialAmount'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-semibold text-foreground'>
                        Fondo de Caja / Monto Inicial ($) <span className='text-destructive'>*</span>
                      </FormLabel>
                      <span className='text-[11px] text-muted-foreground'>
                        Sencillo en efectivo para cambio
                      </span>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <DollarSign className='absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                        <Input
                          type='number'
                          step='0.01'
                          min='0'
                          placeholder='0.00'
                          className='pl-10 text-lg font-bold h-11 tracking-tight'
                          autoFocus
                          value={field.value !== undefined ? field.value : ''}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={openRegisterMutation.isPending}
                        />
                      </div>
                    </FormControl>

                    {/* Quick Amount Selector Chips */}
                    <div className='flex items-center gap-2 pt-1'>
                      <span className='text-[11px] font-medium text-muted-foreground flex items-center gap-1'>
                        <Coins className='h-3.5 w-3.5' /> Sugerido:
                      </span>
                      {QUICK_AMOUNTS.map((amt) => (
                        <Button
                          key={amt}
                          type='button'
                          variant={field.value === amt ? 'default' : 'outline'}
                          size='sm'
                          className='h-6 text-xs px-2.5 rounded-md'
                          onClick={() => form.setValue('initialAmount', amt, { shouldValidate: true })}
                        >
                          ${amt.toFixed(2)}
                        </Button>
                      ))}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes Input */}
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <FormLabel className='text-xs font-semibold text-foreground'>
                      Notas u Observaciones (Opcional)
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <FileText className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground' />
                        <Textarea
                          placeholder='Ej: Fondo entregado por tesorería en billetes fraccionados...'
                          className='pl-10 text-xs min-h-[75px]'
                          {...field}
                          disabled={openRegisterMutation.isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Button */}
              <div className='pt-2'>
                <Button
                  type='submit'
                  size='lg'
                  disabled={openRegisterMutation.isPending}
                  className='w-full text-sm font-semibold h-11'
                >
                  {openRegisterMutation.isPending ? (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  ) : (
                    <LockOpen className='mr-2 size-4' />
                  )}
                  Abrir Caja e Iniciar Cobros
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Right Column: Info & Operational Guidelines (5 cols) */}
      <div className='lg:col-span-5 space-y-4'>
        <Card className='border shadow-sm'>
          <CardHeader className='pb-3 border-b bg-muted/20'>
            <div className='flex items-center gap-2'>
              <ShieldCheck className='h-4 w-4 text-primary' />
              <CardTitle className='text-sm font-semibold'>
                Control y Seguridad de Caja
              </CardTitle>
            </div>
            <CardDescription className='text-xs'>
              Normas operativas para la gestión de fondos y recaudación.
            </CardDescription>
          </CardHeader>

          <CardContent className='p-5 space-y-4 text-xs'>
            {/* Guide Item 1 */}
            <div className='flex gap-3 items-start'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5'>
                <Coins className='h-4 w-4' />
              </div>
              <div className='space-y-0.5'>
                <p className='font-semibold text-foreground text-xs'>Fondo Inicial Registrado</p>
                <p className='text-muted-foreground text-[11px] leading-relaxed'>
                  El monto ingresado quedará asentado como saldo base para el cuadre final en el arqueo de cierre.
                </p>
              </div>
            </div>

            {/* Guide Item 2 */}
            <div className='flex gap-3 items-start'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5'>
                <Receipt className='h-4 w-4' />
              </div>
              <div className='space-y-0.5'>
                <p className='font-semibold text-foreground text-xs'>Cobros y Facturación en Vivo</p>
                <p className='text-muted-foreground text-[11px] leading-relaxed'>
                  Todos los pagos de cuotas y servicios registrados en el sistema se vincularán automáticamente a esta sesión.
                </p>
              </div>
            </div>

            {/* Guide Item 3 */}
            <div className='flex gap-3 items-start'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5'>
                <Info className='h-4 w-4' />
              </div>
              <div className='space-y-0.5'>
                <p className='font-semibold text-foreground text-xs'>Cierre y Arqueo Diario</p>
                <p className='text-muted-foreground text-[11px] leading-relaxed'>
                  Al concluir la jornada de cobros, utiliza la opción de cierre para generar el balance e imprimir el reporte PDF.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
