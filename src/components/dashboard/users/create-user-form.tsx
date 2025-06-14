'use client';
import { useState } from 'react';
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
import { usersService } from '@/services/users';
import { toast } from 'sonner';

export const CreateUserForm = () => {
  const [userInformation, setUserInformation] = useState({
    email: '',
    userName: '',
    roleId: ''
  });
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [emailWasEdited, setEmailWasEdited] = useState(false);
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPerson) return;
    // Only update the person if the email was edited
    if (!selectedPerson.email && userInformation.email && emailWasEdited) {
      await personsService.updatePerson(selectedPerson.personId, {
        identification: selectedPerson.identification,
        lastName: selectedPerson.lastName,
        firstName: selectedPerson.firstName,
        gender: selectedPerson.gender ?? 0,
        birthDate: selectedPerson.birthDate,
        neighborhoodId: selectedPerson.neighborhoodId,
        phoneNumber: selectedPerson.phoneNumber,
        email: userInformation.email,
        status: selectedPerson.status
      });
    }
    // Use the identification as the default password and the first name of the person without spaces
    const password =
      selectedPerson.identification +
      selectedPerson.firstName.replace(/\s/g, '');
    const response = await usersService.createUser({
      username: userInformation.userName,
      roleId: userInformation.roleId,
      personId: selectedPerson.personId,
      password
    });
    if (response.status) {
      toast.success('Usuario creado correctamente');
    } else {
      toast.error('Error al crear el usuario');
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInformation({
      ...userInformation,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'email') setEmailWasEdited(true);
  };

  return (
    <div className='dark:shadow-dark-lg flex h-full w-full flex-col rounded-lg bg-gray-50 shadow-lg dark:bg-gray-800  md:space-y-6 md:p-6'>
      <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
        Crear usuario
      </h1>
      <form className='space-y-4 md:space-y-6' onSubmit={onFormSubmit}>
        <div>
          <SelectPersonDialog
            onSelect={(person) => {
              setSelectedPerson(person);
              setUserInformation((prev) => ({
                ...prev,
                email: person.email || ''
              }));
              setEmailWasEdited(false);
            }}
            triggerLabel={
              selectedPerson
                ? `${selectedPerson.firstName} ${selectedPerson.lastName} (${selectedPerson.identification})`
                : 'Seleccionar persona'
            }
          />
          {selectedPerson && (
            <div className='mt-2 text-sm text-muted-foreground'>
              <div>
                <b>Nombre:</b> {selectedPerson.firstName}{' '}
                {selectedPerson.lastName}
              </div>
              <div>
                <b>Cédula:</b> {selectedPerson.identification}
              </div>
              <div>
                <b>Email:</b> {selectedPerson.email || 'Sin email'}
              </div>
            </div>
          )}
          {!selectedPerson && (
            <div className='mt-2 text-xs text-red-500'>
              Debes seleccionar una persona para crear el usuario.
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor='email'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            Email del usuario
          </label>
          <Input
            type='email'
            name='email'
            id='email'
            placeholder='name@company.com'
            value={userInformation.email}
            onChange={onInputChange}
            required
            disabled={!!selectedPerson?.email}
          />
        </div>
        <div>
          <label
            htmlFor='userName'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            Nombre de usuario
          </label>
          <Input
            type='text'
            name='userName'
            id='userName'
            placeholder='Username'
            value={userInformation.userName}
            onChange={onInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor='roleId'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            Rol
          </label>
          <Select
            value={userInformation.roleId}
            onValueChange={(value) =>
              setUserInformation((prev) => ({ ...prev, roleId: value }))
            }
            disabled={rolesLoading}
            name='roleId'
          >
            <SelectTrigger id='roleId'>
              <SelectValue placeholder='Selecciona un rol' />
            </SelectTrigger>
            <SelectContent>
              {roles &&
                roles.map((role: any) => (
                  <SelectItem key={role.roleId} value={role.roleId}>
                    {role.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type='submit'
          className='hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-stone-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
          disabled={!selectedPerson}
        >
          Crear usuario
        </Button>
      </form>
    </div>
  );
};
