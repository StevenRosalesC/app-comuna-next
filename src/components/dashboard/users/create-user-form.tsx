'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SelectPersonDialog } from '@/components/dashboard/persons/select-person-dialog';
import { Person } from '@/interfaces/persons';
import { useQuery } from '@tanstack/react-query';
import { rolesService } from '@/services/roles';
import { personsService } from '@/services/persons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { usersService } from '@/services/users';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  roleId: z.string().min(1, { message: 'Debes seleccionar un rol.' })
});

export const CreateUserForm = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedPerson) {
      toast.error('Debes seleccionar una persona para crear el usuario.');
      return;
    }

    // Only update the person if the email was edited and is different
    if (selectedPerson.email !== values.email) {
      await personsService.updatePerson(selectedPerson.personId, {
        identification: selectedPerson.identification,
        lastName: selectedPerson.lastName,
        firstName: selectedPerson.firstName,
        gender: selectedPerson.gender,
        birthDate: selectedPerson.birthDate,
        neighborhoodId: selectedPerson.neighborhoodId,
        phoneNumber: selectedPerson.phoneNumber,
        status: selectedPerson.status,
        email: values.email
      });
    }

    try {
      const response = await usersService.createUser({
        roleId: values.roleId,
        personId: selectedPerson.personId
      });
      toast.success(response.message);
      form.reset();
      setSelectedPerson(null);
    } catch (error) {
      toast.error('Error al crear el usuario');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear usuario</CardTitle>
        <CardDescription>
          Selecciona una persona y asígnale un rol.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'
          >
            <div className='md:col-span-2'>
              <SelectPersonDialog
                onSelect={(person) => {
                  setSelectedPerson(person);
                  form.setValue('email', person.email || '');
                  form.clearErrors('email');
                }}
                triggerLabel={
                  selectedPerson
                    ? `${selectedPerson.firstName} ${selectedPerson.lastName} (${selectedPerson.identification})`
                    : 'Seleccionar persona'
                }
              />
              {selectedPerson && (
                <div className='mt-2 text-sm text-muted-foreground'>
                  <b>Nombre:</b> {selectedPerson.firstName}{' '}
                  {selectedPerson.lastName} | <b>Cédula:</b>{' '}
                  {selectedPerson.identification}
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email del usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='name@company.com'
                      {...field}
                      disabled={!!selectedPerson?.email}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='roleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={rolesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona un rol' />
                      </SelectTrigger>
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
            <div className='md:col-span-2'>
              <Button
                type='submit'
                className='w-full'
                disabled={!selectedPerson}
              >
                Crear usuario
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
