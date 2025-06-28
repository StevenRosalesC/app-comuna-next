'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { personsService } from '@/services/persons';
import { IPerson } from '@/interfaces/persons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Events } from '@/interfaces/enums';
import { Neighborhood } from '@/store/neighborhoodsStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  identification: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  gender: z
    .number()
    .min(1, 'El género es requerido')
    .max(2, 'El género debe ser 1 o 2'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  phone: z.string().optional(),
  address: z.string().optional(),
  neighborhoodId: z.string().optional(),
  hasDisability: z.boolean().optional(),
  disabilityPercentage: z.number().min(1, 'El porcentaje debe ser mayor a 0').max(100, 'El porcentaje no puede ser mayor a 100').optional()
}).refine((data) => {
  // If hasDisability is true, disabilityPercentage must be greater than 0
  if (data.hasDisability && (!data.disabilityPercentage || data.disabilityPercentage <= 0)) {
    return false;
  }
  return true;
}, {
  message: "El porcentaje de discapacidad es requerido cuando tiene discapacidad",
  path: ["disabilityPercentage"]
});

type FormValues = z.infer<typeof formSchema>;

export default function InsertPersonForm({
  neighborhoods,
  isLoading
}: {
  neighborhoods: Neighborhood[];
  isLoading: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identification: '',
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      phone: '',
      address: '',
      gender: 1,
      neighborhoodId: '',
      hasDisability: false,
      disabilityPercentage: 0
    }
  });

  // Neighborhood options for Select
  // This variable is outside the JSX for better readability
  const neighborhoodsOptions = neighborhoods?.map(
    (neighborhood: Neighborhood) => (
      <SelectItem
        key={neighborhood.neighborhoodId}
        value={neighborhood.neighborhoodId}
      >
        {neighborhood.neighborhoodName}
      </SelectItem>
    )
  );

  async function onSubmit(data: FormValues) {
    try {
      const person: IPerson = {
        lastName: data.lastName,
        firstName: data.firstName,
        phoneNumber: data.phone,
        identification: data.identification,
        gender: data.gender,
        birthDate: data.birthDate || '',
        email: data.email || '',
        neighborhoodId: data.neighborhoodId,
        hasDisability: data.hasDisability,
        disabilityPercentage: data.disabilityPercentage
      };
      const response = await personsService.createPerson(person);
      if (response.status) {
        const event = new CustomEvent(Events.PERSONS_CREATED, {
          bubbles: true,
          composed: true,
          detail: { person }
        });
        document.dispatchEvent(event);
        toast.success('Persona guardada exitosamente');
        form.reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al guardar la persona');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nueva Persona</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='identification'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingrese la cédula' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingrese los nombres' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingrese los apellidos' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='neighborhoodId'
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barrio</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione el barrio' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <Skeleton className='h-10 w-full' />
                        ) : (
                          neighborhoodsOptions
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione el género' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>Masculino</SelectItem>
                        <SelectItem value='2'>Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Ingrese el email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-2'>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              new Date(field.value).toLocaleDateString(
                                'es-ES',
                                {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                }
                              )
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Input type='date' {...field} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingrese el teléfono' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder='Ingrese la dirección' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* has disability switch y porcentaje juntos */}
                <div className='flex flex-col gap-2'>
                  <FormField
                    control={form.control}
                    name='hasDisability'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2'>
                        <FormLabel>¿Tiene discapacidad?</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue('disabilityPercentage', 0);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch('hasDisability') && (
                    <FormField
                      control={form.control}
                      name='disabilityPercentage'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentaje de Discapacidad (%)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='1'
                              max='100'
                              placeholder='Ingrese el porcentaje de discapacidad'
                              {...field}
                              value={field.value === 0 ? '' : field.value}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => form.reset()}
              >
                Cancelar
              </Button>
              <Button type='submit'>Guardar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
