'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Plus, RotateCw } from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { Requirement } from '@/interfaces/requirements';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

const formSchema = z.object({
  requirement: z.string().min(1, { message: 'Requisito es requerido' }),
  observation: z.string().optional().default('Ninguna'),
  status: z.boolean().default(true)
});

type FormValue = z.infer<typeof formSchema>;

export default function RequirementsTable() {
  const { permissions } = usePermissionsStore();
  const queryClient = useQueryClient();
  const canCreateRequirement = permissions?.[
    ValidModules.REQUIREMENTS
  ]?.includes(ValidActions.CREATE);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['requirements', { pageSize, pageIndex }],
    queryFn: () => requirementsService.list(pageSize, pageIndex * pageSize)
  });
  const requirements = useMemo(() => data?.data ?? [], [data]);
  const totalCount = useMemo(() => data?.count ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
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
    toast.promise(requirementsService.remove(deleteReq.requirementId), {
      loading: 'Eliminando requisito...',
      success: 'Requisito eliminado correctamente',
      error: 'Error al eliminar el requisito'
    });
    refetch();
    setDeleteModalOpen(false);
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Requisitos para ser comunero</h2>
        <div className='flex gap-2'>
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
                  <TableCell>{req.observation}</TableCell>
                  <TableCell>
                    {req.status ? (
                      <span className='font-semibold text-green-600'>
                        Activo
                      </span>
                    ) : (
                      <span className='text-gray-400'>Inactivo</span>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => openModal(req)}
                          >
                            <Icons.userPen className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setDeleteReq(req);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Icons.trash className='h-4 w-4 text-red-600' />
                          </Button>
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
                <TableCell colSpan={4} className='h-24 text-center'>
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
        <DialogContent>
          <DialogTitle>
            {editReq ? 'Editar requisito' : 'Nuevo requisito'}
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='mt-2 space-y-4'
            >
              <FormField
                control={form.control}
                name='requirement'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisito</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Partida de nacimiento'
                        {...field}
                      />
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
                      <Input placeholder='Ej: Opcional' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2 space-y-0'>
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
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={false}
        title='¿Estás seguro de eliminar este requisito?'
        description='Esta acción no se puede deshacer.'
      />
    </>
  );
}
