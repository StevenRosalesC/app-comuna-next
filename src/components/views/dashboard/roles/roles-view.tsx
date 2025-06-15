'use client';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { IUserRolesResponse } from '@/interfaces/roles';
import { rolesService } from '@/services/roles';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ValidModules, ValidActions } from '@/constants/permissions';
import { toast } from 'sonner';
import {
  MODULES_TRANSLATIONS,
  ACTIONS_TRANSLATIONS
} from '@/constants/permissions-translations';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { usePermissionsStore } from '@/store/permissionsStore';

export default function RolesView() {
  const {
    data: roles,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const { permissions: permissionsStore } = usePermissionsStore();
  const canCreateRole = permissionsStore?.[ValidModules.ROLES]?.includes(
    ValidActions.CREATE
  );

  // Find the selected role
  const selectedRole = useMemo(
    () =>
      roles?.find((role: IUserRolesResponse) => role.roleId === selectedRoleId),
    [roles, selectedRoleId]
  );

  // When the selected role changes, update the permissions
  useMemo(() => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions || {});
    }
  }, [selectedRole]);

  // Handle the change of a checkbox
  const handleCheck = (module: string, action: string, checked: boolean) => {
    setPermissions((prev) => {
      const current = prev[module] || [];
      let updated: string[];
      if (checked) {
        updated = Array.from(new Set([...current, action]));
      } else {
        updated = current.filter((a) => a !== action);
      }
      return { ...prev, [module]: updated };
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    // Validate that at least one permission is selected
    const hasPerms = Object.values(permissions).some((arr) => arr.length > 0);
    if (!hasPerms) {
      toast.error('Debes seleccionar al menos un permiso');
      setSaving(false);
      return;
    }
    try {
      await rolesService.updateRolePermissions(
        selectedRole.roleId,
        permissions
      );
      toast.success('Permisos actualizados correctamente');
      refetch();
    } catch (e) {
      toast.error('Error al actualizar los permisos');
    } finally {
      setSaving(false);
    }
  };

  // Default permissions for new role
  const defaultNewPermissions: Record<string, string[]> = Object.fromEntries(
    Object.values(ValidModules).map((module) => {
      if (module === ValidModules.ADMIN || module === ValidModules.DASHBOARD) {
        return [module, []];
      }
      return [module, [ValidActions.READ]];
    })
  );

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<
    Record<string, string[]>
  >(defaultNewPermissions);
  const [creating, setCreating] = useState(false);

  const handleNewCheck = (module: string, action: string, checked: boolean) => {
    setNewRolePermissions((prev) => {
      const current = prev[module] || [];
      let updated: string[];
      if (checked) {
        updated = Array.from(new Set([...current, action]));
      } else {
        updated = current.filter((a) => a !== action);
      }
      return { ...prev, [module]: updated };
    });
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('El nombre del rol es obligatorio');
      return;
    }
    setCreating(true);
    // Validate that at least one permission is selected
    const hasPerms = Object.values(newRolePermissions).some(
      (arr) => arr.length > 0
    );
    if (!hasPerms) {
      toast.error('Debes seleccionar al menos un permiso');
      setCreating(false);
      return;
    }
    try {
      const created = await rolesService.createRole({
        name: newRoleName,
        permissions: newRolePermissions
      });
      toast.success('Rol creado correctamente');
      setNewRoleName('');
      setNewRolePermissions(defaultNewPermissions);
      await refetch();
      // Select the new role automatically
      if (created && created.roleId) {
        setSelectedRoleId(created.roleId);
      } else if (created && created.id) {
        setSelectedRoleId(created.id);
      }
    } catch (e) {
      toast.error('Error al crear el rol');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar permisos de roles</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        ) : (
          <>
            <div className='mb-4'>
              <p className='text-sm text-muted-foreground'>
                Selecciona un rol para editar sus permisos
              </p>
            </div>
            <Select
              value={selectedRoleId || ''}
              onValueChange={setSelectedRoleId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un rol' />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role: IUserRolesResponse) => (
                  <SelectItem key={role.roleId} value={role.roleId}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedRole && canCreateRole && (
              <form
                className='mt-6 space-y-4'
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowCreateConfirm(true);
                }}
              >
                <div>
                  <p className='text-center text-lg font-semibold'>
                    Crea un nuevo rol con los permisos que desees
                  </p>
                </div>
                <div>
                  <label className='mb-2 block font-semibold'>
                    Nombre del nuevo rol
                  </label>
                  <input
                    className='w-full rounded border px-3 py-2 text-sm'
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder='Nombre del rol'
                  />
                </div>
                {Object.values(ValidModules).map((module) => (
                  <div key={module} className='rounded border p-4'>
                    <div className='mb-2 font-semibold'>
                      {MODULES_TRANSLATIONS[module] || module}
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {Object.values(ValidActions)
                        .filter(
                          (action) =>
                            module === 'persons' ||
                            action !== 'approve_requirements'
                        )
                        .map((action) => (
                          <label
                            key={action}
                            className='flex items-center gap-2'
                          >
                            <Checkbox
                              checked={
                                newRolePermissions[module]?.includes(action) ||
                                false
                              }
                              onCheckedChange={(checked) =>
                                handleNewCheck(module, action, Boolean(checked))
                              }
                            />
                            <span className='capitalize'>
                              {ACTIONS_TRANSLATIONS[action] || action}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                ))}
                <div className='flex justify-end'>
                  <AlertDialog
                    open={showCreateConfirm}
                    onOpenChange={setShowCreateConfirm}
                  >
                    <AlertDialogTrigger asChild>
                      <Button type='submit' disabled={creating}>
                        {creating ? 'Creando...' : 'Crear rol'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Crear este rol?</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Seguro que deseas crear el rol <b>{newRoleName}</b>{' '}
                          con los permisos seleccionados?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCreateRole}>
                          Crear
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            )}
            {selectedRole && (
              <>
                <div className='mb-4 mt-4 flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setSelectedRoleId(null)}
                  >
                    <ArrowLeftIcon className='h-4 w-4' /> Añadir nuevo rol
                  </Button>
                </div>
                <form className='mt-2 space-y-4'>
                  {Object.values(ValidModules).map((module) => (
                    <div key={module} className='rounded border p-4'>
                      <div className='mb-2 font-semibold'>
                        {MODULES_TRANSLATIONS[module] || module}
                      </div>
                      <div className='flex flex-wrap gap-4'>
                        {Object.values(ValidActions)
                          .filter(
                            (action) =>
                              module === 'persons' ||
                              action !== 'approve_requirements'
                          )
                          .map((action) => (
                            <label
                              key={action}
                              className='flex items-center gap-2'
                            >
                              <Checkbox
                                checked={
                                  permissions[module]?.includes(action) || false
                                }
                                onCheckedChange={(checked) =>
                                  handleCheck(module, action, Boolean(checked))
                                }
                              />
                              <span className='capitalize'>
                                {ACTIONS_TRANSLATIONS[action] || action}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                  <div className='flex justify-end gap-2'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type='button' variant='destructive'>
                          Eliminar rol
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Eliminar este rol?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Seguro que deseas
                            eliminar el rol <b>{selectedRole?.name}</b>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (!selectedRole) return;
                              try {
                                await rolesService.deleteRole(
                                  selectedRole.roleId
                                );
                                toast.success('Rol eliminado correctamente');
                                setSelectedRoleId(null);
                                refetch();
                              } catch (e: any) {
                                toast.error(
                                  `Error al eliminar el rol: ${e.message}`
                                );
                              }
                            }}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      type='button'
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
