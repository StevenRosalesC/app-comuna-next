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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { toast } from 'sonner';
  import { useEffect, useMemo } from 'react';
  import { useQuery } from '@tanstack/react-query';
  import { requirementsService } from '@/services/requirements';
  import { Requirement } from '@/interfaces/requirements';
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
  import { isAdult } from '@/utils/persons';

  const personFormSchema = z
    .object({
      personId: z.string().optional(),
      identification: z.string().min(1, 'La cédula es requerida'),
      firstName: z.string().min(1, 'El nombre es requerido'),
      lastName: z.string().min(1, 'El apellido es requerido'),
      email: z.string().email('Email inválido').optional().or(z.literal('')),
      birthDate: z.string(),
      neighborhoodId: z.string().optional(),
      phoneNumber: z.string().optional(),
      gender: z.number().optional(),
      status: z.boolean().optional(),
      hasDisability: z.boolean().optional(),
      disabilityPercentage: z
        .number()
        .min(1, 'El porcentaje debe ser mayor a 0')
        .max(100, 'El porcentaje no puede ser mayor a 100')
        .optional()
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
      resolver: zodResolver(personFormSchema),
      defaultValues: {
        personId: '',
        identification: '',
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        neighborhoodId: '',
        phoneNumber: '',
        gender: 1,
        status: true,
        hasDisability: false,
        disabilityPercentage: undefined
      }
    });

    const neighborhoods = useNeighborhoodsStore((state) => state.neighborhoods);

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
          gender: person.gender || 0,
          status: person.status ?? true,
          hasDisability: person.hasDisability ?? false,
          disabilityPercentage:
            person.disabilityPercentage && person.disabilityPercentage > 0
              ? person.disabilityPercentage
              : undefined
        });
      }
    }, [person, form.reset, form]);

    function onSubmit(data: PersonFormValues) {
      try {
        const personToSave: Person = {
          personId: person?.personId || '',
          gender: data.gender || person?.gender || 0,
          phoneNumber: person?.phoneNumber || '',
          identification: data.identification,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || '',
          birthDate: new Date(data.birthDate),
          neighborhoodId: data.neighborhoodId || null,
          status: data.status ?? true,
          hasDisability: data.hasDisability ?? false,
          disabilityPercentage: data.disabilityPercentage ?? 0
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

    const { data: allRequirements = [] } = useQuery<Requirement[]>({
      queryKey: ['requirements-all'],
      queryFn: () => requirementsService.listAll(),
      enabled: open
    });

    const approvedRequirements = useMemo(() => {
      if (!person) return [];
      return (person.personRequirement || [])
        .filter((req) => req.status === 'APPROVED')
        .map((req) => ({
          requirementId: req.requirement.requirementId,
          requirementName: req.requirement.requirement,
          approvedByUser: req.approvedByUser
        }));
    }, [person]);

    const pendingRequirements = useMemo(() => {
      if (!person) return [];
      const activeSysReqs = allRequirements.filter((req) => req.status !== false);

      if (activeSysReqs.length > 0) {
        return activeSysReqs
          .filter((sysReq) => {
            const pr = person.personRequirement?.find(
              (r) =>
                r.requirement?.requirementId === sysReq.requirementId ||
                (r as any).requirementId === sysReq.requirementId
            );
            return !pr || pr.status !== 'APPROVED';
          })
          .map((sysReq) => {
            const pr = person.personRequirement?.find(
              (r) =>
                r.requirement?.requirementId === sysReq.requirementId ||
                (r as any).requirementId === sysReq.requirementId
            );
            return {
              requirementId: sysReq.requirementId,
              requirementName: sysReq.requirement,
              observation: pr?.observation || sysReq.observation || null
            };
          });
      }

      return (person.personRequirement || [])
        .filter((req) => req.status !== 'APPROVED')
        .map((req) => ({
          requirementId: req.requirement.requirementId,
          requirementName: req.requirement.requirement,
          observation: req.observation || null
        }));
    }, [allRequirements, person]);

    if (!person) return null;
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='w-full max-h-[80vh] overflow-auto'>
          <DialogHeader>
            <DialogTitle>Editar Persona</DialogTitle>
            <DialogDescription>
              Realice los cambios necesarios en el formulario. Haga clic en
              guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
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
                <FormField
                  control={form.control}
                  name='hasDisability'
                  render={({ field }) => (
                    <FormItem className='mt-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel>Tiene Discapacidad</FormLabel>
                        <FormDescription>
                          Activa esta opción si el comunero tiene un carnet de
                          discapacidad.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Reset disability percentage when disabling
                            if (!checked) {
                              form.setValue('disabilityPercentage', undefined);
                            }
                          }}
                        />
                      </FormControl>
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
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              field.onChange(
                                rawValue === '' ? undefined : Number(rawValue)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {person.status && isAdult(new Date(person.birthDate)) && (
                  <div className='flex flex-col gap-2'>
                    {approvedRequirements.length > 0 && (
                      <div className='mt-4 flex flex-col gap-2 rounded-lg border border-green-200 bg-green-50/20 dark:border-green-900 p-4'>
                        <span className='w-full text-center text-sm font-bold text-green-700 dark:text-green-400'>
                          Requisitos aprobados ({approvedRequirements.length})
                        </span>
                        <ul className='flex flex-col gap-3 pl-2'>
                          {approvedRequirements.map((req) => (
                            <li
                              key={req.requirementId}
                              className='text-sm'
                            >
                              <p className='font-semibold'>
                                {req.requirementName}
                              </p>
                              {req.approvedByUser && (
                                <p className='text-xs text-muted-foreground'>
                                  Aprobado por:{' '}
                                  {req.approvedByUser.person?.firstName}{' '}
                                  {req.approvedByUser.person?.lastName}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pendingRequirements.length > 0 && (
                      <div className='mt-4 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/20 dark:border-amber-900 p-4'>
                        <span className='w-full text-center text-sm font-bold text-amber-700 dark:text-amber-400'>
                          Requisitos pendientes ({pendingRequirements.length})
                        </span>
                        <ul className='flex flex-col gap-3 pl-2'>
                          {pendingRequirements.map((req) => (
                            <li
                              key={req.requirementId}
                              className='text-sm'
                            >
                              <p className='font-semibold'>
                                {req.requirementName}
                              </p>
                              {req.observation && (
                                <p className='text-xs text-muted-foreground'>
                                  Observación: {req.observation}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={!form.formState.isValid}>
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
