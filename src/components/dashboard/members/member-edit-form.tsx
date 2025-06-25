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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemberById, updateMember } from '@/services/members';
import { personsService } from '@/services/persons';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  identification: z.string().min(1, 'La identificación es requerida'),
  email: z
    .string()
    .email('Email inválido')
    .or(z.literal(''))
    .optional()
    .nullable(),
  phoneNumber: z.string().or(z.literal('')).optional().nullable(),
  gender: z.string(),
  birthDate: z.date(),
  houseNumber: z.string().min(1, 'El número de casa es requerido')
});

export default function MemberEditForm({ memberId }: { memberId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: member,
    isLoading,
    error
  } = useQuery({
    queryKey: ['members', memberId],
    queryFn: () => getMemberById(memberId)
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: member?.person.firstName ?? '',
      lastName: member?.person.lastName ?? '',
      identification: member?.person.identification ?? '',
      email: member?.person.email ?? null,
      phoneNumber: member?.person.phoneNumber ?? null,
      gender: member?.person.gender.toString() ?? '0',
      birthDate: member?.person.birthDate
        ? new Date(member.person.birthDate)
        : new Date(),
      houseNumber: member?.houseNumber ?? ''
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!member) throw new Error('No se encontró el miembro');

      const { houseNumber, ...personValues } = values;

      const personDataToUpdate = {
        ...member.person,
        ...personValues,
        gender: parseInt(personValues.gender, 10)
      };

      // Remove non-updatable fields from person data and handle nulls
      const { personId, personRequirement, email, phoneNumber, ...rest } =
        personDataToUpdate;

      const updatablePersonData = {
        ...rest,
        email: email || '',
        phoneNumber: phoneNumber || ''
      };

      const memberPromise = updateMember(memberId, { houseNumber });
      const personPromise = personsService.updatePerson(
        member.person.personId,
        updatablePersonData
      );

      return Promise.all([memberPromise, personPromise]);
    },
    onSuccess: () => {
      toast.success('Miembro actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['members', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      router.push(`/dashboard/members/${memberId}`);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || 'Error al actualizar el miembro');
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-1/4' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-1/4' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error al cargar la información del miembro.</div>;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Miembro</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 md:grid-cols-2'
          >
            <FormField
              control={form.control}
              name='identification'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificación</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div />
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione un género' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='0'>Masculino</SelectItem>
                      <SelectItem value='1'>Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='birthDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
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
                            format(field.value, 'PPP')
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='houseNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Casa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={mutation.isPending}
              className='md:col-span-2'
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
