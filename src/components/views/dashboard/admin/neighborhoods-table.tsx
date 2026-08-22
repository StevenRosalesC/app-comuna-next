'use client';
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { RotateCw, Plus, MapPin, Loader2, Save, Sparkles, Building2, Users, Pencil, Trash2 } from 'lucide-react';
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

  const form = useForm<FormValue>({
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

  const mutation = useMutation({
    mutationFn: async (values: FormValue) => {
      if (editNeighborhood) {
        return neighborhoodsService.updateNeighborhood(
          editNeighborhood.neighborhoodId,
          values
        );
      } else {
        return neighborhoodsService.createNeighborhood(values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
      toast.success(
        editNeighborhood
          ? 'Barrio actualizado correctamente'
          : 'Barrio creado correctamente'
      );
      setModalOpen(false);
      setEditNeighborhood(null);
      form.reset();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        (editNeighborhood
          ? 'Error al actualizar el barrio'
          : 'Error al crear el barrio');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => neighborhoodsService.deleteNeighborhood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
      toast.success('Barrio eliminado correctamente');
      setDeleteModalOpen(false);
      setDeleteNeighborhood(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Error al eliminar el barrio';
      toast.error(errorMessage);
    }
  });

  const openModal = (neighborhood: Neighborhood | null = null) => {
    setEditNeighborhood(neighborhood);
    if (neighborhood) {
      form.reset({ neighborhoodName: neighborhood.neighborhoodName });
    } else {
      form.reset({ neighborhoodName: '' });
    }
    setModalOpen(true);
  };

  const onSubmit = (values: FormValue) => {
    mutation.mutate(values);
  };

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
    return (
      <div className='p-4 text-center text-destructive'>
        Error al cargar los barrios.
      </div>
    );
  }

  return (
    <>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>Barrios</h2>
          <p className='text-sm text-muted-foreground'>
            Sectores y barrios registrados dentro de la comunidad.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {canCreateNeighborhood && (
            <Button onClick={() => openModal(null)}>
              <Plus className='mr-2 h-4 w-4' />
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

      <div className='mb-4'>
        <Input
          placeholder='Buscar por nombre...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full sm:max-w-sm'
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Barrio</TableHead>
              <TableHead>Personas Registradas</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className='h-4 w-32 animate-pulse rounded bg-muted'></div>
                  </TableCell>
                  <TableCell>
                    <div className='h-4 w-16 animate-pulse rounded bg-muted'></div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <div className='h-8 w-8 animate-pulse rounded bg-muted'></div>
                      <div className='h-8 w-8 animate-pulse rounded bg-muted'></div>
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
                  <TableCell className='text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Users className='h-3.5 w-3.5 text-muted-foreground' />
                      <span>{neighborhood._count?.persons || 0} personas</span>
                    </div>
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
                                <Pencil className='h-4 w-4' />
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
                                <Trash2 className='h-4 w-4 text-destructive' />
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
                <TableCell colSpan={3} className='py-8 text-center text-muted-foreground'>
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

      {/* Unified Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
          {/* Enhanced Header */}
          <div className={`p-6 pb-4 border-b ${editNeighborhood ? 'bg-amber-500/5' : 'bg-primary/5'}`}>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                  editNeighborhood
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-primary/20 bg-primary/10 text-primary'
                }`}
              >
                {editNeighborhood ? (
                  <Building2 className='h-5 w-5' />
                ) : (
                  <Sparkles className='h-5 w-5' />
                )}
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    {editNeighborhood ? 'Editar Barrio' : 'Nuevo Barrio'}
                  </DialogTitle>
                  <Badge
                    variant='outline'
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 ${
                      editNeighborhood
                        ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        : 'border-primary/30 text-primary bg-primary/10'
                    }`}
                  >
                    {editNeighborhood ? 'Edición' : 'Creación'}
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  {editNeighborhood
                    ? 'Modifica el nombre y parámetros del sector comunal.'
                    : 'Ingresa los datos para registrar un nuevo barrio en la comuna.'}
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <div className='p-6 pt-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                <FormField
                  control={form.control}
                  name='neighborhoodName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>
                        Nombre del barrio <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: San José, Central, etc.'
                            className='pl-9'
                            autoFocus
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className='text-[11px] text-muted-foreground'>
                        Identificador oficial del barrio o sector comunal.
                      </p>
                      <FormMessage />
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
                    className={editNeighborhood ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                  >
                    {mutation.isPending ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : editNeighborhood ? (
                      <Save className='mr-2 size-4' />
                    ) : (
                      <Plus className='mr-2 size-4' />
                    )}
                    {editNeighborhood ? 'Guardar Cambios' : 'Crear Barrio'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={deleteMutation.isPending}
        confirmText='Eliminar'
        cancelText='Cancelar'
        title='Eliminar barrio'
        description={`¿Estás seguro de que quieres eliminar el barrio "${deleteNeighborhood?.neighborhoodName}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
} 