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
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
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
import {
  Pencil,
  Save,
  User as UserIcon,
  Mail,
  Shield,
  Loader2,
  AlertTriangle
} from 'lucide-react';

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
  onSave?: (user: User) => Promise<void> | void;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave
}: UserEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        email: user.person?.email || '',
        status: user.status ?? true,
        role: user.roleId || user.role?.roleId || ''
      });
    }
  }, [user, form.reset, form]);

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    try {
      const userToSave = {
        userId: user?.userId || '',
        username: data.username,
        status: data.status ?? true,
        roleId: data.role || ''
      };
      await onSave?.(userToSave as User);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error is handled in the parent callback
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) return null;

  const isCurrentUser = session?.id === user?.userId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-amber-500/5'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs'>
              <Pencil className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Editar Usuario
                </DialogTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                >
                  Edición
                </Badge>
              </div>
              <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                Actualiza las credenciales, rol y estado de la cuenta de usuario.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <div className='p-6 pt-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold'>
                      Nombre de Usuario <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <UserIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                          placeholder='nombre.usuario'
                          className='pl-9'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-semibold'>
                      Rol Asignado <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={rolesLoading || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <div className='flex items-center gap-2'>
                            <Shield className='h-4 w-4 text-muted-foreground' />
                            <SelectValue placeholder='Selecciona un rol' />
                          </div>
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

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-xl border bg-muted/30 p-3.5'>
                    <div className='space-y-0.5'>
                      <div className='flex items-center gap-2'>
                        <FormLabel className='text-sm font-medium'>
                          Estado de la Cuenta
                        </FormLabel>
                        <Badge
                          variant={field.value ? 'default' : 'secondary'}
                          className='text-[10px] py-0'
                        >
                          {field.value ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {isCurrentUser
                          ? 'No puedes desactivar tu propia cuenta.'
                          : 'Permite el inicio de sesión y acceso a los módulos.'}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isCurrentUser || isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isCurrentUser && (
                <div className='flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400'>
                  <AlertTriangle className='h-4 w-4 shrink-0' />
                  <span>Estás editando tu cuenta activa de sesión.</span>
                </div>
              )}

              <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t mt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-amber-600 hover:bg-amber-700 text-white'
                >
                  {isSubmitting ? (
                    <Loader2 className='mr-2 size-4 animate-spin' />
                  ) : (
                    <Save className='mr-2 size-4' />
                  )}
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
