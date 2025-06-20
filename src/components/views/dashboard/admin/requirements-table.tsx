'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
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
import { Plus, RotateCw } from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { useQuery } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { Requirement } from '@/interfaces/requirements';

const formSchema = z.object({
  requirement: z.string().min(1, { message: 'Requisito es requerido' }),
  observation: z
    .string()
    .min(1, { message: 'Observación es requerida' })
    .default('Ninguna'),
  status: z.boolean().default(true)
});

type FormValue = z.infer<typeof formSchema>;

export default function RequirementsTable() {
  const { permissions } = usePermissionsStore();
  const canCreateRequirement = permissions?.[
    ValidModules.REQUIREMENTS
  ]?.includes(ValidActions.CREATE);

  // React Query
  const {
    data: requirements,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery<Requirement[]>({
    queryKey: ['requirements'],
    queryFn: () => requirementsService.list()
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editReq, setEditReq] = useState<Requirement | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<FormValue>({
    requirement: '',
    observation: 'Ninguna',
    status: true
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReq, setDeleteReq] = useState<Requirement | null>(null);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { requirement: '', observation: 'Ninguna', status: true }
  });

  // Open modal for edit
  const openModal = (req: Requirement | null = null) => {
    setEditReq(req);
    form.reset(
      req
        ? {
            requirement: req.requirement,
            observation: req.observation,
            status: req.status
          }
        : { requirement: '', observation: '', status: true }
    );
    setModalOpen(true);
  };

  // Save requirement (edit)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editReq) {
      toast.promise(
        requirementsService.update(editReq.requirementId, form.getValues()),
        {
          loading: 'Actualizando requisito...',
          success: 'Requisito actualizado correctamente',
          error: 'Error al actualizar el requisito'
        }
      );
      refetch();
      setModalOpen(false);
      form.reset();
    }
  };

  // Delete requirement
  const handleDelete = async (id: string) => {
    toast.promise(requirementsService.remove(id), {
      loading: 'Eliminando requisito...',
      success: 'Requisito eliminado correctamente',
      error: 'Error al eliminar el requisito'
    });
    refetch();
    setDeleteModalOpen(false);
  };

  // Add requirement
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.getValues();
    try {
      toast.promise(requirementsService.create(values), {
        loading: 'Añadiendo requisito...',
        success: 'Requisito añadido correctamente',
        error: 'Error al añadir el requisito'
      });
      refetch();
      setAddModalOpen(false);
      form.reset();
    } catch {
      toast.error('Error al añadir el requisito');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar los requisitos');
    }
  }, [error]);

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Requisitos para ser comunero</h2>
        <div className='flex gap-2'>
          {canCreateRequirement && (
            <>
              <Button
                onClick={() => setAddModalOpen(true)}
                className='rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-primary/90'
              >
                <Plus className='h-4 w-4' /> Nuevo requisito
              </Button>
              <Button
                onClick={() => refetch()}
                variant='outline'
                className='px-4 py-2 font-semibold shadow'
                title='Recargar requisitos'
              >
                <RotateCw
                  className={`h-4 w-4 ${isFetching ? 'animate-spin ' : ''}`}
                />
              </Button>
            </>
          )}
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columnCount={4} rowCount={6} />
      ) : (
        <Table className='min-w-full divide-y divide-gray-200'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-1/2 px-4 py-2 text-left text-xs font-medium uppercase'>
                Requisito
              </TableHead>
              <TableHead className='w-1/2 px-4 py-2 text-left text-xs font-medium uppercase'>
                Observación
              </TableHead>
              <TableHead className='w-1/4 px-4 py-2 text-left text-xs font-medium uppercase'>
                Estado
              </TableHead>
              <TableHead className='w-1/4 px-4 py-2 text-left text-xs font-medium uppercase'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-gray-200'>
            {requirements?.map((req: Requirement) => (
              <TableRow key={req.requirementId}>
                <TableCell className='px-4 py-2'>{req.requirement}</TableCell>
                <TableCell className='px-4 py-2'>{req.observation}</TableCell>
                <TableCell className='px-4 py-2'>
                  {req.status ? (
                    <span className='font-semibold text-green-600'>Activo</span>
                  ) : (
                    <span className='text-gray-400'>Inactivo</span>
                  )}
                </TableCell>
                <TableCell className='flex justify-end gap-2 px-4 py-2 text-right'>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='p-1 text-blue-600 hover:text-blue-800'
                          onClick={() => openModal(req)}
                          aria-label='Editar'
                        >
                          <Icons.userPen className='h-5 w-5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className='p-1 text-red-600 hover:text-red-800'
                          onClick={() => {
                            setDeleteReq(req);
                            setDeleteModalOpen(true);
                          }}
                          aria-label='Eliminar'
                        >
                          <Icons.trash className='h-5 w-5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Eliminar</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Modal for edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>
            {editReq ? 'Editar requisito' : 'Nuevo requisito'}
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={handleSave} className='mt-2 space-y-4'>
              <FormField
                control={form.control}
                name='requirement'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisito</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='observation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observación</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ninguna' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit'>Guardar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Modal for add */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogTitle>Nuevo requisito</DialogTitle>
          <form onSubmit={handleAdd} className='mt-2 space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Descripción
              </label>
              <Input {...form.register('requirement')} required />
              <label className='mb-1 block text-sm font-medium'>
                Observación
              </label>
              <Input {...form.register('observation')} />
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset();
                  setAddModalOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type='submit'>Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Botón flotante para nuevo requisito */}
      <button
        className='fixed bottom-8 right-8 z-50 rounded-full bg-primary px-4 py-2 text-white shadow-lg transition-colors hover:bg-primary/90'
        onClick={() => setAddModalOpen(true)}
        aria-label='Agregar nuevo requisito'
      >
        +
      </button>
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDelete(deleteReq?.requirementId || '')}
        loading={isLoading}
        title='¿Estás seguro?'
        description='Esta acción no se puede deshacer.'
      />
    </>
  );
}
