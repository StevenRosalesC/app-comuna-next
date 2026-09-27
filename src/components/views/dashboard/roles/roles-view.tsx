'use client';

import { useState, useMemo, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertModal } from '@/components/modal/alert-modal';
import { CreateRoleDialog } from './create-role-dialog';
import { IUserRolesResponse } from '@/interfaces/roles';
import { rolesService } from '@/services/roles';
import { useQuery } from '@tanstack/react-query';
import { usePermissionsStore } from '@/store/permissionsStore';
import {
  ValidModules,
  ValidActions,
  getModuleActions,
  modulesPermissions
} from '@/constants/permissions';
import {
  MODULES_TRANSLATIONS,
  ACTIONS_TRANSLATIONS
} from '@/constants/permissions-translations';
import { toast } from 'sonner';
import {
  Shield,
  ShieldCheck,
  ShieldPlus,
  Layers,
  KeyRound,
  Lock,
  Search,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  SlidersHorizontal,
  Check,
  Plus
} from 'lucide-react';

export default function RolesView() {
  const {
    data: roles,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles()
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [searchRole, setSearchRole] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { permissions: permissionsStore } = usePermissionsStore();
  const canCreateRole = permissionsStore?.[ValidModules.ROLES]?.includes(
    ValidActions.CREATE
  );
  const canUpdateRole = permissionsStore?.[ValidModules.ROLES]?.includes(
    ValidActions.UPDATE
  );
  const canDeleteRole = permissionsStore?.[ValidModules.ROLES]?.includes(
    ValidActions.DELETE
  );

  // Auto-select first role once data is loaded if none is selected
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].roleId);
    }
  }, [roles, selectedRoleId]);

  // Find the selected role
  const selectedRole = useMemo(
    () =>
      roles?.find((role: IUserRolesResponse) => role.roleId === selectedRoleId),
    [roles, selectedRoleId]
  );

  // When selected role changes, synchronize permissions state
  useEffect(() => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions || {});
    }
  }, [selectedRole]);

  // Filter roles by search input
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    if (!searchRole.trim()) return roles;
    return roles.filter((role: IUserRolesResponse) =>
      role.name.toLowerCase().includes(searchRole.toLowerCase())
    );
  }, [roles, searchRole]);

  // Handle checking a single permission
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

  // Select all permissions for a module
  const handleSelectAllModule = (module: string, checked: boolean) => {
    setPermissions((prev) => {
      if (checked) {
        return { ...prev, [module]: getModuleActions(module) };
      } else {
        return { ...prev, [module]: [] };
      }
    });
  };

  // Check if all permissions for a module are active
  const isAllModuleSelected = (module: string) => {
    const moduleActions = getModuleActions(module);
    const selectedActions = permissions[module] || [];
    return (
      moduleActions.length > 0 &&
      moduleActions.every((action) => selectedActions.includes(action))
    );
  };

  // Global toggle all permissions
  const handleSelectAllGlobally = () => {
    const allPerms = Object.fromEntries(
      modulesPermissions.map((m) => [m.module, m.actions])
    );
    setPermissions(allPerms);
  };

  const handleClearAllGlobally = () => {
    const emptyPerms = Object.fromEntries(
      modulesPermissions.map((m) => [m.module, []])
    );
    setPermissions(emptyPerms);
  };

  // Count active permissions on selected role
  const activePermissionsCount = useMemo(() => {
    return Object.values(permissions).reduce(
      (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
      0
    );
  }, [permissions]);

  // Total possible permissions in the whole system
  const totalPossiblePermissions = useMemo(() => {
    return modulesPermissions.reduce(
      (acc, curr) => acc + curr.actions.length,
      0
    );
  }, []);

  // Save changes to current role
  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);

    const hasPerms = Object.values(permissions).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
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
      await refetch();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Error al actualizar los permisos'
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete current role
  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setIsDeleting(true);
    try {
      await rolesService.deleteRole(selectedRole.roleId);
      toast.success('Rol eliminado correctamente');
      setDeleteModalOpen(false);
      setSelectedRoleId(null);
      await refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Error al eliminar el rol');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Roles y Permisos'
            description='Administración centralizada de roles de usuario y control de acceso basado en roles (RBAC) para cada módulo del sistema.'
          />
          {canCreateRole && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className='shrink-0'
            >
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Rol
            </Button>
          )}
        </div>
        <Separator />

        {/* KPI Metric Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total Roles */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Roles Registrados</CardTitle>
              <Shield className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{roles?.length ?? 0}</div>
              )}
              <CardDescription className='text-xs'>
                Perfiles de autorización
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2: Modules Covered */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Módulos del Sistema</CardTitle>
              <Layers className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{modulesPermissions.length}</div>
              <CardDescription className='text-xs'>
                Módulos parametrizados
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3: Active Permissions in Selected Role */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Permisos Asignados</CardTitle>
              <KeyRound className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold text-primary'>
                  {activePermissionsCount}{' '}
                  <span className='text-xs font-normal text-muted-foreground'>
                    / {totalPossiblePermissions}
                  </span>
                </div>
              )}
              <CardDescription className='text-xs'>
                {selectedRole ? `En rol: ${selectedRole.name}` : 'Selecciona un rol'}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 4: Access Control Mode */}
          <Card className='transition-all hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Control de Acceso</CardTitle>
              <Lock className='h-4 w-4 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <span className='h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' />
                <div className='text-lg font-bold text-foreground'>RBAC Activo</div>
              </div>
              <CardDescription className='text-xs'>
                Seguridad granular por acción
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Master-Detail 2-Column Interface */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {/* Left Column: Roles List Sidebar (4 cols) */}
          <Card className='lg:col-span-4 h-fit border shadow-sm'>
            <CardHeader className='pb-3 border-b'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='h-5 w-5 text-primary' />
                  <CardTitle className='text-base font-semibold'>
                    Roles de Usuario
                  </CardTitle>
                </div>
                <Badge variant='secondary' className='text-xs'>
                  {filteredRoles.length}
                </Badge>
              </div>
              <div className='relative mt-3'>
                <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  placeholder='Buscar rol...'
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className='pl-8 h-8 text-xs'
                />
              </div>
            </CardHeader>

            <CardContent className='p-2 pt-3 space-y-1.5'>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-14 w-full rounded-lg' />
                ))
              ) : filteredRoles.length === 0 ? (
                <div className='p-6 text-center text-xs text-muted-foreground'>
                  No se encontraron roles.
                </div>
              ) : (
                filteredRoles.map((role: IUserRolesResponse) => {
                  const isSelected = role.roleId === selectedRoleId;
                  const rolePermCount = Object.values(role.permissions || {}).reduce(
                    (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
                    0
                  );

                  return (
                    <button
                      key={role.roleId}
                      type='button'
                      onClick={() => setSelectedRoleId(role.roleId)}
                      className={`w-full text-left flex items-center justify-between rounded-xl p-3 transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-2 border-primary text-primary shadow-xs font-semibold'
                          : 'hover:bg-muted/60 border border-transparent text-foreground'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-xs'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Shield className='h-4 w-4' />
                        </div>
                        <div>
                          <p className='text-sm leading-none font-medium'>
                            {role.name}
                          </p>
                          <p className='text-[11px] text-muted-foreground mt-1'>
                            {rolePermCount} permisos activos
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className='h-4 w-4 text-primary shrink-0' />
                      )}
                    </button>
                  );
                })
              )}

              {canCreateRole && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCreateDialogOpen(true)}
                  className='w-full mt-3 text-xs border-dashed'
                >
                  <Plus className='mr-1.5 h-3.5 w-3.5' />
                  Crear Nuevo Rol
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Permissions Matrix for Selected Role (8 cols) */}
          <Card className='lg:col-span-8 border shadow-sm'>
            {selectedRole ? (
              <>
                <CardHeader className='pb-4 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <SlidersHorizontal className='h-4 w-4' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <CardTitle className='text-lg font-semibold tracking-tight'>
                            {selectedRole.name}
                          </CardTitle>
                          <Badge variant='outline' className='text-[11px] font-mono'>
                            {activePermissionsCount} / {totalPossiblePermissions}
                          </Badge>
                        </div>
                        <CardDescription className='text-xs text-muted-foreground'>
                          Configura las acciones y accesos permitidos para este rol.
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Select Actions */}
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handleSelectAllGlobally}
                      disabled={!canUpdateRole}
                      className='h-8 text-xs'
                    >
                      <CheckCircle2 className='mr-1.5 h-3.5 w-3.5 text-emerald-500' />
                      Marcar todos
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handleClearAllGlobally}
                      disabled={!canUpdateRole}
                      className='h-8 text-xs text-muted-foreground'
                    >
                      Desmarcar
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className='p-6 space-y-4'>
                  {/* Module Cards Grid */}
                  <div className='space-y-4'>
                    {modulesPermissions.map((moduleConfig) => {
                      const moduleName =
                        MODULES_TRANSLATIONS[moduleConfig.module] ||
                        moduleConfig.label;
                      const isAllSelected = isAllModuleSelected(
                        moduleConfig.module
                      );
                      const actions = getModuleActions(moduleConfig.module);
                      const selectedInModule =
                        permissions[moduleConfig.module] || [];

                      return (
                        <div
                          key={moduleConfig.module}
                          className='rounded-xl border bg-card p-4 transition-all hover:border-primary/40'
                        >
                          <div className='mb-3 flex items-center justify-between border-b pb-2.5'>
                            <div className='flex items-center gap-2.5'>
                              <span className='font-semibold text-sm text-foreground'>
                                {moduleName}
                              </span>
                              <Badge
                                variant={
                                  selectedInModule.length === actions.length &&
                                  actions.length > 0
                                    ? 'default'
                                    : 'secondary'
                                }
                                className='text-[10px] py-0'
                              >
                                {selectedInModule.length}/{actions.length}
                              </Badge>
                            </div>
                            {canUpdateRole && (
                              <div className='flex items-center gap-1.5'>
                                <Checkbox
                                  id={`select-all-${moduleConfig.module}`}
                                  checked={isAllSelected}
                                  onCheckedChange={(checked) =>
                                    handleSelectAllModule(
                                      moduleConfig.module,
                                      Boolean(checked)
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`select-all-${moduleConfig.module}`}
                                  className='cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none'
                                >
                                  Todo el módulo
                                </label>
                              </div>
                            )}
                          </div>

                          <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
                            {actions.map((action) => {
                              const isChecked =
                                selectedInModule.includes(action);
                              const actionLabel =
                                ACTIONS_TRANSLATIONS[action] || action;

                              return (
                                <label
                                  key={action}
                                  className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors cursor-pointer select-none ${
                                    isChecked
                                      ? 'border-primary/40 bg-primary/5 text-foreground font-medium'
                                      : 'border-muted bg-muted/20 text-muted-foreground hover:bg-muted/40'
                                  }`}
                                >
                                  <span className='capitalize'>
                                    {actionLabel}
                                  </span>
                                  <Switch
                                    checked={isChecked}
                                    disabled={!canUpdateRole}
                                    onCheckedChange={(checked) =>
                                      handleCheck(
                                        moduleConfig.module,
                                        action,
                                        checked
                                      )
                                    }
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sticky Actions Footer */}
                  <div className='sticky bottom-0 -mx-6 -mb-6 mt-6 flex items-center justify-between border-t bg-background/95 backdrop-blur-sm p-4 px-6 rounded-b-xl shadow-lg'>
                    <div>
                      {canDeleteRole && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => setDeleteModalOpen(true)}
                          className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                        >
                          <Trash2 className='mr-1.5 h-3.5 w-3.5' />
                          Eliminar Rol
                        </Button>
                      )}
                    </div>
                    {canUpdateRole && (
                      <Button
                        type='button'
                        size='sm'
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        ) : (
                          <Save className='mr-2 size-4' />
                        )}
                        Guardar Cambios
                      </Button>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className='flex min-h-[400px] flex-col items-center justify-center p-8 text-center'>
                <Shield className='h-12 w-12 text-muted-foreground/40 mb-3' />
                <p className='text-base font-semibold'>Ningún rol seleccionado</p>
                <p className='text-xs text-muted-foreground max-w-sm mt-1'>
                  Selecciona un rol del menú lateral para consultar o editar sus permisos.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Create Role Modal */}
      {canCreateRole && (
        <CreateRoleDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onRoleCreated={(newRoleId) => {
            refetch();
            if (newRoleId) {
              setSelectedRoleId(newRoleId);
            }
          }}
        />
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteRole}
        loading={isDeleting}
        confirmText='Eliminar Rol'
        cancelText='Cancelar'
        title={`¿Eliminar el rol "${selectedRole?.name}"?`}
        description='Esta acción no se puede deshacer y revocará todos los permisos asignados a este rol.'
      />
    </PageContainer>
  );
}
