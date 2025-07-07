'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSessionContext } from '@/components/providers/session-Provider';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

// Validation schema for profile update
const profileUpdateSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').optional().or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  email: z.string().email('Por favor proporciona una dirección de correo válida').optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileUpdateSchema>;

interface UpdateProfileRequest {
  username?: string;
  password?: string;
  email?: string;
}

interface UpdateProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Record<string, string[]>;
}

export default function UserProfileForm() {
  const { session } = useSessionContext();
  const { updateProfile, loading, error } = useProfileUpdate();
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: session?.username || '',
      password: '',
      confirmPassword: '',
      email: session?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSuccess(null);

    try {
      // Only include fields that have values
      const updateData: UpdateProfileRequest = {};
      if (data.username && data.username.trim()) {
        updateData.username = data.username.trim();
      }
      if (data.password && data.password.trim()) {
        updateData.password = data.password.trim();
      }
      if (data.email && data.email.trim()) {
        updateData.email = data.email.trim();
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        throw new Error('Por favor proporciona al menos un campo para actualizar');
      }

      await updateProfile(updateData);
      setSuccess('¡Perfil actualizado exitosamente!');

      // Reset password fields
      form.setValue('password', '');
      form.setValue('confirmPassword', '');

    } catch (err: any) {
      // Error is handled by the hook
      console.error('Profile update error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading
          title="Configuración del Perfil"
          description="Actualiza la información de tu cuenta y configuración."
        />
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu nombre de usuario, email y contraseña. Deja los campos vacíos si no quieres cambiarlos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresa nuevo nombre de usuario"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ingresa nuevo correo electrónico"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa nueva contraseña"
                            {...field}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirma nueva contraseña"
                            {...field}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={loading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Actual</CardTitle>
          <CardDescription>
            Tu información de perfil actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <p className="text-sm text-muted-foreground">
                {session?.firstName} {session?.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Nombre de Usuario</label>
              <p className="text-sm text-muted-foreground">
                {session?.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Correo Electrónico</label>
              <p className="text-sm text-muted-foreground">
                {session?.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <p className="text-sm text-muted-foreground">
                {session?.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 