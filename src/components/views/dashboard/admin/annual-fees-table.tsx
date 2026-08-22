'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  getAnnualFees,
  createAnnualFee,
  updateAnnualFee,
  deleteAnnualFee
} from '@/services/annual-fee';
import { AnnualFee } from '@/interfaces/annual-fee';
import { AnnualFeesTableRowSkeleton } from './annual-fees-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { AxiosError } from 'axios';
import {
  RotateCw,
  Plus,
  DollarSign,
  Loader2,
  Save,
  Sparkles,
  Tag,
  FileText,
  Calendar,
  CircleDollarSign,
  Pencil,
  Trash2
} from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { AlertModal } from '@/components/modal/alert-modal';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  description: z.string(),
  amount: z.number().min(0, { message: 'El monto no puede ser negativo' }),
  status: z.boolean(),
  year: z.number().int().min(2000, { message: 'Año no válido' })
});

type FormValue = z.infer<typeof formSchema>;

export default function AnnualFeesTable() {
  const queryClient = useQueryClient();
  const { permissions } = usePermissionsStore();
  const canCreateAnnualFee = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.CREATE_ANNUAL_FEE
  );
  const canUpdateAnnualFee = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.UPDATE_ANNUAL_FEE
  );
  const canDeleteAnnualFee = permissions?.[ValidModules.ADMIN]?.includes(
    ValidActions.DELETE_ANNUAL_FEE
  );

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState<string>('');

  const debouncedSearch = useDebounce(search, 500);

  const [modalOpen, setModalOpen] = useState(false);
  const [editFee, setEditFee] = useState<AnnualFee | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFeeId, setDeleteFeeId] = useState<string | null>(null);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      status: true,
      year: new Date().getFullYear()
    }
  });

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, year]);

  const { data, isLoading, isError, isFetching, refetch } = useQuery<{
    data: AnnualFee[];
    count: number;
  }>({
    queryKey: ['annualFees', { pageIndex, pageSize, debouncedSearch, year }],
    queryFn: () =>
      getAnnualFees({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
        year: year ? Number(year) : undefined
      })
  });

  const annualFees = useMemo(() => data?.data ?? [], [data]);
  const totalCount = useMemo(() => data?.count ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const mutation = useMutation({
    mutationFn: async (values: FormValue) => {
      if (editFee) {
        return updateAnnualFee(editFee.feeId, values);
      } else {
        return createAnnualFee(values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success(
        editFee
          ? 'Cuota actualizada correctamente'
          : 'Cuota añadida correctamente'
      );
      setModalOpen(false);
      setEditFee(null);
      form.reset();
    },
    onError: () => {
      toast.error(
        editFee ? 'Error al actualizar la cuota' : 'Error al añadir la cuota'
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnualFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success('Cuota eliminada correctamente');
      setDeleteModalOpen(false);
      setDeleteFeeId(null);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Error al eliminar la cuota';
      toast.error(errorMessage);
    }
  });

  const openModal = (fee: AnnualFee | null = null) => {
    setEditFee(fee);
    if (fee) {
      form.reset({
        name: fee.name,
        description: fee.description || '',
        amount: fee.amount,
        status: fee.status,
        year: fee.year
      });
    } else {
      form.reset({
        name: '',
        description: '',
        amount: 0,
        status: true,
        year: new Date().getFullYear()
      });
    }
    setModalOpen(true);
  };

  const onSubmit = (values: FormValue) => {
    mutation.mutate(values);
  };

  const handleDeleteConfirm = () => {
    if (deleteFeeId) {
      deleteMutation.mutate(deleteFeeId);
    }
  };

  if (isError) {
    return (
      <div className='p-4 text-center text-destructive'>
        Error al cargar las cuotas anuales.
      </div>
    );
  }

  return (
    <>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>
            Cuotas Anuales
          </h2>
          <p className='text-sm text-muted-foreground'>
            Configuración y montos de cuotas anuales por periodo.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {canCreateAnnualFee && canUpdateAnnualFee && (
            <Button onClick={() => openModal(null)}>
              <Plus className='mr-2 h-4 w-4' /> Nueva cuota
            </Button>
          )}
          <Button
            onClick={() => refetch()}
            variant='outline'
            title='Recargar cuotas'
            size='icon'
          >
            <RotateCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin ' : ''}`}
            />
          </Button>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center'>
        <Input
          placeholder='Buscar por nombre...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full sm:max-w-sm'
        />
        <Input
          type='number'
          placeholder='Filtrar por año...'
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className='w-full sm:max-w-xs'
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto ($)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Año</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <AnnualFeesTableRowSkeleton key={i} />
              ))
            ) : annualFees.length > 0 ? (
              annualFees.map((fee) => (
                <TableRow key={fee.feeId}>
                  <TableCell className='font-medium'>{fee.name}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {fee.description || 'N/A'}
                  </TableCell>
                  <TableCell className='font-semibold'>
                    ${Number(fee.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={fee.status ? 'default' : 'secondary'}>
                      {fee.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{fee.year}</TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {canUpdateAnnualFee && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openModal(fee)}
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
                          {canDeleteAnnualFee && (
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => {
                                setDeleteFeeId(fee.feeId);
                                setDeleteModalOpen(true);
                              }}
                              disabled={deleteMutation.isPending}
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
                <TableCell
                  colSpan={6}
                  className='h-24 text-center text-muted-foreground'
                >
                  No hay cuotas anuales registradas.
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

      {/* Modal for create/edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-[520px] p-0 overflow-hidden'>
          {/* Enhanced Header */}
          <div className={`p-6 pb-4 border-b ${editFee ? 'bg-amber-500/5' : 'bg-primary/5'}`}>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                  editFee
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-primary/20 bg-primary/10 text-primary'
                }`}
              >
                {editFee ? (
                  <CircleDollarSign className='h-5 w-5' />
                ) : (
                  <Sparkles className='h-5 w-5' />
                )}
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    {editFee ? 'Editar Cuota Anual' : 'Nueva Cuota Anual'}
                  </DialogTitle>
                  <Badge
                    variant='outline'
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 ${
                      editFee
                        ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        : 'border-primary/30 text-primary bg-primary/10'
                    }`}
                  >
                    {editFee ? 'Edición' : 'Creación'}
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  {editFee
                    ? 'Actualiza los valores, monto y periodo de la cuota seleccionada.'
                    : 'Ingresa los datos para registrar y parametrizar una nueva cuota anual.'}
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
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>
                        Nombre de la cuota <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: Cuota Anual 2026'
                            className='pl-9'
                            autoFocus
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>Descripción</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <FileText className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: Pago ordinario de mantenimiento y servicios'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-3'>
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-semibold'>
                          Monto ($) <span className='text-destructive'>*</span>
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='0.00'
                              className='pl-9'
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === '' ? 0 : Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='year'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-semibold'>
                          Año <span className='text-destructive'>*</span>
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              type='number'
                              placeholder='2026'
                              className='pl-9'
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === '' ? 0 : Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-between rounded-xl border bg-muted/30 p-3.5'>
                      <div className='space-y-0.5'>
                        <div className='flex items-center gap-2'>
                          <FormLabel className='text-sm font-medium'>Cuota Habilitada</FormLabel>
                          <Badge variant={field.value ? 'default' : 'secondary'} className='text-[10px] py-0'>
                            {field.value ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Habilitar para cobro y asignación a comuneros
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
                    className={editFee ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                  >
                    {mutation.isPending ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : editFee ? (
                      <Save className='mr-2 size-4' />
                    ) : (
                      <Plus className='mr-2 size-4' />
                    )}
                    {editFee ? 'Guardar Cambios' : 'Crear Cuota'}
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
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        confirmText='Eliminar'
        cancelText='Cancelar'
        title='¿Estás seguro de eliminar esta cuota?'
        description='Esta acción eliminará el registro de la cuota anual.'
      />
    </>
  );
}
