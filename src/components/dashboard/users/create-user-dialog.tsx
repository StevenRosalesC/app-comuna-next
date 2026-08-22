'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SelectPersonDialog } from '@/components/dashboard/persons/select-person-dialog';
import { Person } from '@/interfaces/persons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesService } from '@/services/roles';
import { personsService } from '@/services/persons';
import { usersService } from '@/services/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  Sparkles,
  UserPlus,
  Mail,
  Shield,
  Loader2,
  UserCheck,
  IdCard
} from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  roleId: z.string().min(1, { message: 'Debes seleccionar un rol.' })
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      roleId: ''
    }
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    form.setValue('email', person.email || '');
    form.clearErrors('email');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setSelectedPerson(null);
      onOpenChange(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedPerson) {
      toast.error('Debes seleccionar una persona para crear el usuario.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update email in person record if modified
      if (selectedPerson.email !== values.email) {
        await personsService.updatePerson(selectedPerson.personId, {
          identification: selectedPerson.identification,
          lastName: selectedPerson.lastName,
          firstName: selectedPerson.firstName,
          gender: selectedPerson.gender,
          birthDate: selectedPerson.birthDate,
          neighborhoodId: selectedPerson.neighborhoodId ?? null,
          phoneNumber: selectedPerson.phoneNumber,
          status: selectedPerson.status,
          email: values.email
        });
      }

      const response = await usersService.createUser({
        roleId: values.roleId,
        personId: selectedPerson.personId
      });

      if (response.status) {
        toast.success(response.message || 'Usuario creado correctamente');
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['users-stats'] });
        handleClose();
      } else {
        toast.error(response.message || 'Error al crear el usuario');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al crear el usuario'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-primary/5'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs'>
              <Sparkles className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Nuevo Usuario
                </DialogTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-primary/30 text-primary bg-primary/10'
                >
                  Creación
                </Badge>
              </div>
              <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                Selecciona una persona registrada y asígnale un rol de acceso al sistema.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className='p-6 pt-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Person Selection Box */}
              <div className='space-y-2'>
                <FormLabel className='text-xs font-semibold'>
                  Persona Asignada <span className='text-destructive'>*</span>
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <SelectPersonDialog
                    onSelect={handlePersonSelect}
                    triggerLabel={
                      selectedPerson
                        ? 'Cambiar persona'
                        : 'Buscar y seleccionar persona'
                    }
                  />
                </div>
                {selectedPerson ? (
                  <div className='flex items-center justify-between rounded-xl border bg-muted/40 p-3 text-xs'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <UserCheck className='h-4 w-4' />
                      </div>
                      <div>
                        <p className='font-semibold text-foreground'>
                          {selectedPerson.firstName} {selectedPerson.lastName}
                        </p>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                          <span className='flex items-center gap-1 font-mono'>
                            <IdCard className='h-3 w-3' />
                            {selectedPerson.identification}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant='outline' className='text-[10px]'>
                      Seleccionado
                    </Badge>
                  </div>
                ) : (
                  <p className='text-[11px] text-muted-foreground'>
                    Debes vincular una persona existente para crear su cuenta de usuario.
                  </p>
                )}
              </div>

              {/* Email Field */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold'>
                      Correo Electrónico <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                          placeholder='nombre@ejemplo.com'
                          className='pl-9'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <p className='text-[11px] text-muted-foreground'>
                      Email para notificaciones y credenciales de acceso.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name='roleId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold'>
                      Rol en el Sistema <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={rolesLoading || isSubmitting}
                    >
                      <FormControl>
                        <div className='relative'>
                          <SelectTrigger className='w-full'>
                            <div className='flex items-center gap-2'>
                              <Shield className='h-4 w-4 text-muted-foreground' />
                              <SelectValue placeholder='Selecciona un rol de usuario' />
                            </div>
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        {roles &&
                          roles.map((role: any) => (
                            <SelectItem key={role.roleId} value={role.roleId}>
                              {role.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t mt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={!selectedPerson || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  ) : (
                    <UserPlus className='mr-2 size-4' />
                  )}
                  Crear Usuario
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
