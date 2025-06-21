'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Person } from '@/interfaces/persons';
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
import { toast } from 'sonner';
import { useEffect } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { Select } from '@/components/ui/select';
import { useNeighborhoodsStore } from '@/hooks/store/useNeighborhoodsStore';
import { Neighborhood } from '@/store/neighborhoodsStore';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

const personFormSchema = z.object({
  personId: z.string().optional(),
  identification: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  birthDate: z.string(),
  neighborhoodId: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.number().optional(),
  status: z.boolean().optional()
});

type PersonFormValues = z.infer<typeof personFormSchema>;

interface PersonEditDialogProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (person: Person) => void;
}

export function PersonEditDialog({
  person,
  open,
  onOpenChange,
  onSave
}: PersonEditDialogProps) {
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema)
  });

  const { neighborhoods } = useNeighborhoodsStore((state) => ({
    neighborhoods: state.neighborhoods
  }));

  useEffect(() => {
    if (person) {
      form.reset({
        identification: person.identification,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email || '',
        birthDate: person.birthDate
          ? new Date(person.birthDate).toISOString().split('T')[0]
          : '',
        neighborhoodId: person.neighborhoodId || '',
        status: person.status ?? true
      });
    }
  }, [person, form.reset, form]);

  function onSubmit(data: PersonFormValues) {
    try {
      const personToSave: Person = {
        personId: person?.personId || '',
        gender: person?.gender || 0,
        phoneNumber: person?.phoneNumber || '',
        identification: data.identification,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || '',
        birthDate: new Date(data.birthDate),
        neighborhoodId: data.neighborhoodId || '',
        status: data.status ?? true
      };
      onSave?.(personToSave);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Error al actualizar la persona');
    }
  }

  const neighborhoodsOptions = neighborhoods.map(
    (neighborhood: Neighborhood) => (
      <SelectItem
        key={neighborhood.neighborhoodId}
        value={neighborhood.neighborhoodId}
      >
        {neighborhood.neighborhoodName}
      </SelectItem>
    )
  );

  if (!person) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] '>
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
          <DialogDescription>
            Realice los cambios necesarios en el formulario. Haga clic en
            guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <ScrollArea className='h-[calc(100vh-300px)]'>
              <FormField
                control={form.control}
                name='identification'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                name='neighborhoodId'
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
                      <SelectContent>{neighborhoodsOptions}</SelectContent>
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
                      <Input {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input {...field} type='date' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='mt-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Estado</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {person.status && (
                <>
                  {person.requirementApprovals &&
                    person.requirementApprovals.length > 0 && (
                      <div className='mt-4 flex flex-col gap-2 rounded-lg border p-4'>
                        <span className='w-full text-center text-sm font-bold'>
                          Requisitos aprobados
                        </span>
                        <ul className='flex flex-col gap-3 pl-2'>
                          {person.requirementApprovals.map((approval) => (
                            <li key={approval.approvalId} className='text-sm'>
                              <p className='font-semibold'>
                                {approval.requirements.requirement}
                              </p>
                              <p className='text-xs text-gray-500'>
                                Aprobado por:{' '}
                                {approval.approvedByUser.persons.firstName}{' '}
                                {approval.approvedByUser.persons.lastName}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </ScrollArea>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={!form.formState.isDirty}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
