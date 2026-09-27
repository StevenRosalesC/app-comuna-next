'use client';
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { RequirementsTableRowSkeleton } from './requirements-table-row-skeleton';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AlertModal } from '@/components/modal/alert-modal';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ListChecks,
  Loader2,
  Plus,
  RotateCw,
  Save,
  Sparkles,
  CheckSquare,
  FileText,
  Pencil,
  Trash2
} from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { Requirement } from '@/interfaces/requirements';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

const formSchema = z.object({
  requirement: z.string().min(1, { message: 'Requisito es requerido' }),
  observation: z.string().min(1, { message: 'Observación es requerida' }),
  status: z.boolean()
});

type FormValue = z.infer<typeof formSchema>;

export default function RequirementsTable() {
  const { permissions } = usePermissionsStore();
  const queryClient = useQueryClient();
  const canCreateRequirement =
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.CREATE_REQUIREMENTS) ||
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.CREATE) ||
    permissions?.[ValidModules.REQUIREMENTS]?.includes(ValidActions.CREATE);

  const canUpdateRequirement =
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.UPDATE_REQUIREMENTS) ||
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.UPDATE) ||
    permissions?.[ValidModules.REQUIREMENTS]?.includes(ValidActions.UPDATE);

  const canDeleteRequirement =
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.DELETE_REQUIREMENTS) ||
    permissions?.[ValidModules.ADMIN]?.includes(ValidActions.DELETE) ||
    permissions?.[ValidModules.REQUIREMENTS]?.includes(ValidActions.DELETE);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['requirements', { pageSize, pageIndex }],
    queryFn: () => requirementsService.list(pageSize, pageIndex * pageSize)
  });
  const requirements = useMemo(() => data?.data ?? [], [data]);
  const totalCount = useMemo(() => data?.count ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.max(Math.ceil(totalCount / pageSize), 1),
    [totalCount, pageSize]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editReq, setEditReq] = useState<Requirement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReq, setDeleteReq] = useState<Requirement | null>(null);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { requirement: '', observation: 'Ninguna', status: true }
  });

  // Mutation for creating/updating
  const mutation = useMutation({
    mutationFn: async (data: FormValue) => {
      if (editReq) {
        return requirementsService.update(editReq.requirementId, data);
      } else {
        return requirementsService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(
        editReq
          ? 'Requisito actualizado correctamente'
          : 'Requisito añadido correctamente'
      );
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      queryClient.invalidateQueries({ queryKey: ['requirements-stats'] });
      setModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error(
        editReq
          ? 'Error al actualizar el requisito'
          : 'Error al añadir el requisito'
      );
    }
  });

  // Open modal for edit or add
  const openModal = (req: Requirement | null = null) => {
    setEditReq(req);
    form.reset(
      req
        ? {
          requirement: req.requirement,
          observation: req.observation,
          status: req.status
        }
        : { requirement: '', observation: 'Ninguna', status: true }
    );
    setModalOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: FormValue) => {
    mutation.mutate(data);
  };

  // Delete requirement
  const handleDelete = async () => {
    if (!deleteReq) return;
    try {
      await requirementsService.remove(deleteReq.requirementId);
      toast.success('Requisito eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      queryClient.invalidateQueries({ queryKey: ['requirements-stats'] });
    } catch {
      toast.error('Error al eliminar el requisito');
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>
            Requisitos para ser comunero
          </h2>
          <p className='text-sm text-muted-foreground'>
            Administra los requisitos y documentos necesarios para el registro de comuneros.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {canCreateRequirement && (
            <Button onClick={() => openModal(null)}>
              <Plus className='mr-2 h-4 w-4' /> Nuevo requisito
            </Button>
          )}
          <Button
            onClick={() => refetch()}
            variant='outline'
            title='Recargar requisitos'
            size='icon'
          >
            <RotateCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin ' : ''}`}
            />
          </Button>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisito</TableHead>
              <TableHead>Observación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <RequirementsTableRowSkeleton key={i} />
              ))
            ) : requirements && requirements.length > 0 ? (
              requirements.map((req: Requirement) => (
                <TableRow key={req.requirementId}>
                  <TableCell className='font-medium'>
                    {req.requirement}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {req.observation || 'Ninguna'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={req.status ? 'default' : 'secondary'}>
                      {req.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {canUpdateRequirement && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openModal(req)}
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {canDeleteRequirement && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => {
                                setDeleteReq(req);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className='h-4 w-4 text-destructive' />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
                  No hay requisitos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='mt-4'>
        <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
          {totalCount} registros en total.
        </div>
        <DataTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>
      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
          {/* Enhanced Header */}
          <div className={`p-6 pb-4 border-b ${editReq ? 'bg-amber-500/5' : 'bg-primary/5'}`}>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                  editReq
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-primary/20 bg-primary/10 text-primary'
                }`}
              >
                {editReq ? (
                  <ListChecks className='h-5 w-5' />
                ) : (
                  <Sparkles className='h-5 w-5' />
                )}
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    {editReq ? 'Editar Requisito' : 'Nuevo Requisito'}
                  </DialogTitle>
                  <Badge
                    variant='outline'
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 ${
                      editReq
                        ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        : 'border-primary/30 text-primary bg-primary/10'
                    }`}
                  >
                    {editReq ? 'Edición' : 'Creación'}
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  {editReq
                    ? 'Actualiza los datos y obligatoriedad del requisito.'
                    : 'Ingresa los datos para registrar un nuevo requisito de membresía.'}
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
                  name='requirement'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>
                        Requisito <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <CheckSquare className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: Partida de nacimiento original'
                            className='pl-9'
                            autoFocus
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className='text-[11px] text-muted-foreground'>
                        Nombre descriptivo del requisito solicitado.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='observation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>
                        Observación / Instrucciones
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <FileText className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: Documento original o copia notariada'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className='text-[11px] text-muted-foreground'>
                        Indicaciones adicionales para la presentación del documento.
                      </p>
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
                            Estado del Requisito
                          </FormLabel>
                          <Badge variant={field.value ? 'default' : 'secondary'} className='text-[10px] py-0'>
                            {field.value ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Habilitar para exigencia activa a comuneros
                        </p>
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
                <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t mt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    disabled={mutation.isPending}
                    className={editReq ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                  >
                    {mutation.isPending ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : editReq ? (
                      <Save className='mr-2 size-4' />
                    ) : (
                      <Plus className='mr-2 size-4' />
                    )}
                    {editReq ? 'Guardar Cambios' : 'Crear Requisito'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={false}
        confirmText='Eliminar'
        cancelText='Cancelar'
        title='¿Estás seguro de eliminar este requisito?'
        description='Esta acción eliminará el requisito de forma permanente.'
      />
    </>
  );
}
