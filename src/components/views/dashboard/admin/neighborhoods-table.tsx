'use client';
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { neighborhoodsService, Neighborhood, CreateNeighborhoodDto, UpdateNeighborhoodDto } from '@/services/neighborhoods';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { AxiosError } from 'axios';
import { RotateCw, Plus } from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { AlertModal } from '@/components/modal/alert-modal';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  neighborhoodName: z.string().min(1, { message: 'Nombre del barrio es requerido' })
});

type FormValue = z.infer<typeof formSchema>;

export default function NeighborhoodsTable() {
  const queryClient = useQueryClient();
  const { permissions } = usePermissionsStore();
  const canCreateNeighborhood = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.CREATE_NEIGHBORHOOD
  );
  const canUpdateNeighborhood = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.UPDATE_NEIGHBORHOOD
  );
  const canDeleteNeighborhood = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.DELETE_NEIGHBORHOOD
  );

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [modalOpen, setModalOpen] = useState(false);
  const [editNeighborhood, setEditNeighborhood] = useState<Neighborhood | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteNeighborhood, setDeleteNeighborhood] = useState<Neighborhood | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit form
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { neighborhoodName: '' }
  });

  // Add form
  const addForm = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { neighborhoodName: '' }
  });

  React.useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['neighborhoods', { pageIndex, pageSize, debouncedSearch }],
    queryFn: () =>
      neighborhoodsService.getNeighborhoods({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
        orderBy: 'neighborhoodName',
        order: 'asc'
      })
  });

  const neighborhoods = useMemo(() => data?.neighborhoods ?? [], [data]);
  const totalCount = useMemo(() => data?.count ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const createMutation = useMutation({
    mutationFn: (data: CreateNeighborhoodDto) => neighborhoodsService.createNeighborhood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
      toast.success('Barrio creado correctamente');
      setAddModalOpen(false);
      addForm.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el barrio';
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNeighborhoodDto }) =>
      neighborhoodsService.updateNeighborhood(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
      toast.success('Barrio actualizado correctamente');
      setModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el barrio';
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => neighborhoodsService.deleteNeighborhood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
      toast.success('Barrio eliminado correctamente');
      setDeleteModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el barrio';
      toast.error(errorMessage);
    }
  });

  // Open modal for edit
  const openModal = (neighborhood: Neighborhood | null = null) => {
    setEditNeighborhood(neighborhood);
    if (neighborhood) {
      form.reset({ neighborhoodName: neighborhood.neighborhoodName });
    } else {
      form.reset({ neighborhoodName: '' });
    }
    setModalOpen(true);
  };

  // Save neighborhood (edit)
  const onEditSubmit = (values: FormValue) => {
    if (editNeighborhood) {
      updateMutation.mutate({ id: editNeighborhood.neighborhoodId, data: values });
    }
  };

  // Add neighborhood
  const onAddSubmit = (values: FormValue) => {
    createMutation.mutate(values);
  };

  // Delete neighborhood
  const handleDelete = (neighborhood: Neighborhood) => {
    setDeleteNeighborhood(neighborhood);
    setDeleteModalOpen(true);
  };

  const onDeleteConfirm = () => {
    if (deleteNeighborhood) {
      deleteMutation.mutate(deleteNeighborhood.neighborhoodId);
    }
  };

  if (isError) {
    return <div>Error al cargar los barrios.</div>;
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Barrios</h2>
        <div className='flex items-center gap-2'>
          {canCreateNeighborhood && (
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo barrio
            </Button>
          )}
          <Button
            onClick={() => refetch()}
            variant='outline'
            title='Recargar barrios'
            size='icon'
          >
            <RotateCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin ' : ''}`}
            />
          </Button>
        </div>
      </div>
      <div className='mb-4 flex items-center gap-2'>
        <Input
          placeholder='Buscar por nombre...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Barrio</TableHead>
              <TableHead>Personas</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : neighborhoods.length > 0 ? (
              neighborhoods.map((neighborhood) => (
                <TableRow key={neighborhood.neighborhoodId}>
                  <TableCell className='font-medium'>
                    {neighborhood.neighborhoodName}
                  </TableCell>
                  <TableCell>
                    {neighborhood._count?.persons || 0} personas
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      {canUpdateNeighborhood && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => openModal(neighborhood)}
                              >
                                <Icons.edit className='h-4 w-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar barrio</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {canDeleteNeighborhood && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleDelete(neighborhood)}
                              >
                                <Icons.trash className='h-4 w-4' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar barrio</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='text-center py-8'>
                  No se encontraron barrios
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

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>Editar barrio</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='neighborhoodName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del barrio</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: San José' {...field} />
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
                <Button type='submit' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogTitle>Nuevo barrio</DialogTitle>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className='space-y-4'>
              <FormField
                control={addForm.control}
                name='neighborhoodName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del barrio</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: San José' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creando...' : 'Crear'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={deleteMutation.isPending}
        title='Eliminar barrio'
        description={`¿Estás seguro de que quieres eliminar el barrio "${deleteNeighborhood?.neighborhoodName}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
} 