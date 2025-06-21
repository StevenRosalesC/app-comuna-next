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
import { User } from '@/interfaces/users';
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
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rolesService } from '@/services/roles';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useSessionContext } from '@/components/providers/session-Provider';

const userFormSchema = z.object({
  userId: z.string().optional(),
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  email: z.string().email('Email inválido'),
  status: z.boolean().optional(),
  role: z.string().optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (user: User) => void;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave
}: UserEditDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema)
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const { session } = useSessionContext();

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.person.email,
        status: user.status ?? true,
        role: user.roleId || user.userRoles?.roleId || ''
      });
    }
  }, [user, form.reset, form]);

  function onSubmit(data: UserFormValues) {
    try {
      const userToSave = {
        userId: user?.userId || '',
        username: data.username,
        status: data.status ?? true,
        roleId: data.role || ''
      };
      onSave?.(userToSave as User);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling
    }
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] '>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Realice los cambios necesarios en el formulario. Haga clic en
            guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={rolesLoading}
                    >
                      <SelectTrigger>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => {
                const isCurrentUser = session?.id === user?.userId;
                return (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isCurrentUser}
                      />
                    </FormControl>
                    {isCurrentUser && (
                      <p className='text-xs text-muted-foreground'>
                        No puedes desactivar tu propio usuario.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button type='submit'>Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
