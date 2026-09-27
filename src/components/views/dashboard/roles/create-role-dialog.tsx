'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { rolesService } from '@/services/roles';
import { toast } from 'sonner';
import {
  Sparkles,
  Shield,
  Loader2,
  CheckCircle2,
  ListCheck
} from 'lucide-react';
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

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleCreated?: (roleId: string) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onRoleCreated
}: CreateRoleDialogProps) {
  const [roleName, setRoleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default permissions: read only
  const defaultPermissions: Record<string, string[]> = useMemo(() => {
    return Object.fromEntries(
      modulesPermissions.map((moduleConfig) => {
        if (
          moduleConfig.module === ValidModules.ADMIN ||
          moduleConfig.module === ValidModules.DASHBOARD
        ) {
          return [moduleConfig.module, []];
        }
        return [
          moduleConfig.module,
          moduleConfig.actions.includes(ValidActions.READ)
            ? [ValidActions.READ]
            : []
        ];
      })
    );
  }, []);

  const [permissions, setPermissions] = useState<Record<string, string[]>>(defaultPermissions);

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

  const handleSelectAllModule = (module: string, checked: boolean) => {
    setPermissions((prev) => {
      if (checked) {
        return { ...prev, [module]: getModuleActions(module) };
      } else {
        return { ...prev, [module]: [] };
      }
    });
  };

  const isAllModuleSelected = (module: string) => {
    const moduleActions = getModuleActions(module);
    const selectedActions = permissions[module] || [];
    return (
      moduleActions.length > 0 &&
      moduleActions.every((action) => selectedActions.includes(action))
    );
  };

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

  const handleClose = () => {
    if (!isSubmitting) {
      setRoleName('');
      setPermissions(defaultPermissions);
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('El nombre del rol es obligatorio');
      return;
    }

    const hasPerms = Object.values(permissions).some((arr) => arr.length > 0);
    if (!hasPerms) {
      toast.error('Debes seleccionar al menos un permiso');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await rolesService.createRole({
        name: roleName.trim(),
        permissions
      });
      toast.success('Rol creado correctamente');
      const newId = created?.roleId || created?.id || '';
      handleClose();
      onRoleCreated?.(newId);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear el rol');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSelectedCount = useMemo(() => {
    return Object.values(permissions).reduce((acc, curr) => acc + curr.length, 0);
  }, [permissions]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[650px] p-0 overflow-hidden max-h-[90vh] flex flex-col'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-primary/5 shrink-0'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs'>
              <Sparkles className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Crear Nuevo Rol
                </DialogTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-primary/30 text-primary bg-primary/10'
                >
                  Creación
                </Badge>
              </div>
              <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                Define el nombre del rol y configura sus privilegios de acceso para cada módulo.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className='flex flex-col flex-1 overflow-hidden'>
          <div className='p-6 pt-4 space-y-5 overflow-y-auto flex-1'>
            {/* Role Name Input */}
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold'>
                Nombre del Rol <span className='text-destructive'>*</span>
              </label>
              <div className='relative'>
                <Shield className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Ej: Tesorero, Supervisor, Auditor'
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className='pl-9'
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className='flex items-center justify-between border-y py-2.5 text-xs'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-foreground'>Permisos asignados:</span>
                <Badge variant='secondary' className='text-[11px]'>
                  {totalSelectedCount} permisos
                </Badge>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={handleSelectAllGlobally}
                  className='h-7 text-xs px-2'
                >
                  <CheckCircle2 className='mr-1 h-3 w-3' />
                  Marcar todos
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={handleClearAllGlobally}
                  className='h-7 text-xs px-2 text-muted-foreground'
                >
                  Desmarcar todos
                </Button>
              </div>
            </div>

            {/* Permissions by Module */}
            <div className='space-y-3'>
              {modulesPermissions.map((moduleConfig) => {
                const moduleName =
                  MODULES_TRANSLATIONS[moduleConfig.module] || moduleConfig.label;
                const isAllSelected = isAllModuleSelected(moduleConfig.module);
                const actions = getModuleActions(moduleConfig.module);
                const selectedInModule = permissions[moduleConfig.module] || [];

                return (
                  <div
                    key={moduleConfig.module}
                    className='rounded-xl border bg-card p-3.5 transition-all hover:border-primary/30'
                  >
                    <div className='mb-3 flex items-center justify-between border-b pb-2.5'>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold text-sm text-foreground'>
                          {moduleName}
                        </span>
                        <Badge variant='outline' className='text-[10px] py-0'>
                          {selectedInModule.length}/{actions.length}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Checkbox
                          id={`create-select-all-${moduleConfig.module}`}
                          checked={isAllSelected}
                          onCheckedChange={(checked) =>
                            handleSelectAllModule(moduleConfig.module, Boolean(checked))
                          }
                        />
                        <label
                          htmlFor={`create-select-all-${moduleConfig.module}`}
                          className='cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none'
                        >
                          Todo el módulo
                        </label>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
                      {actions.map((action) => {
                        const isChecked = selectedInModule.includes(action);
                        const actionLabel =
                          ACTIONS_TRANSLATIONS[action] || action;

                        return (
                          <label
                            key={action}
                            className={`flex items-center justify-between rounded-lg border p-2 text-xs transition-colors cursor-pointer select-none ${
                              isChecked
                                ? 'border-primary/40 bg-primary/5 text-foreground'
                                : 'border-muted bg-muted/20 text-muted-foreground hover:bg-muted/40'
                            }`}
                          >
                            <span className='font-medium capitalize'>
                              {actionLabel}
                            </span>
                            <Switch
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleCheck(moduleConfig.module, action, checked)
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
          </div>

          {/* Footer */}
          <DialogFooter className='p-4 border-t bg-muted/20 shrink-0 gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting || !roleName.trim()}>
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <ListCheck className='mr-2 size-4' />
              )}
              Crear Rol
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
