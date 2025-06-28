'use client';
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import {
  getAnnualFees,
  createAnnualFee,
  updateAnnualFee,
  deleteAnnualFee
} from '@/services/annual-fee';
import {
  AnnualFee,
  CreateAnnualFee,
  UpdateAnnualFee
} from '@/interfaces/annual-fee';
import { AnnualFeesTableRowSkeleton } from './annual-fees-table-row-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { AxiosError } from 'axios';
import { RotateCw } from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

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
  const [form, setForm] = useState<UpdateAnnualFee>({
    description: '',
    amount: 0,
    status: true
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<CreateAnnualFee>({
    description: '',
    amount: 0,
    status: true,
    name: '',
    year: new Date().getFullYear()
  });

  React.useEffect(() => {
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

  const createMutation = useMutation({
    mutationFn: createAnnualFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success('Cuota añadida correctamente');
      setAddModalOpen(false);
      setAddForm({
        description: '',
        amount: 0,
        status: true,
        name: '',
        year: new Date().getFullYear()
      });
    },
    onError: () => {
      toast.error('Error al añadir la cuota');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ feeId, fee }: { feeId: string; fee: UpdateAnnualFee }) =>
      updateAnnualFee(feeId, fee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success('Cuota actualizada correctamente');
      setModalOpen(false);
    },
    onError: () => {
      toast.error('Error al actualizar la cuota');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnualFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success('Cuota eliminada');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'Error al eliminar la cuota';
      toast.error(errorMessage);
    }
  });

  // Open modal for edit
  const openModal = (fee: AnnualFee | null = null) => {
    setEditFee(fee);
    setForm(
      fee
        ? {
            description: fee.description,
            amount: fee.amount,
            status: fee.status,
            name: fee.name,
            year: fee.year
          }
        : {
            description: '',
            amount: 0,
            status: true,
            name: '',
            year: new Date().getFullYear()
          }
    );
    setModalOpen(true);
  };

  // Save annual fee (edit)
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editFee) {
      updateMutation.mutate({ feeId: editFee.feeId, fee: form });
    }
  };

  // Delete annual fee
  const handleDelete = (feeId: string) => {
    deleteMutation.mutate(feeId);
  };

  // Add annual fee
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(addForm);
  };

  if (isError) {
    return <div>Error al cargar las cuotas anuales.</div>;
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Cuotas anuales</h2>
        <div className='flex items-center gap-2'>
          {canCreateAnnualFee && canUpdateAnnualFee && (
            <Button onClick={() => setAddModalOpen(true)}>+ Nueva cuota</Button>
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
      <div className='mb-4 flex items-center gap-2'>
        <Input
          placeholder='Buscar por nombre...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />
        <Input
          type='number'
          placeholder='Filtrar por año...'
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className='max-w-xs'
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
                  <TableCell>{fee.name}</TableCell>
                  <TableCell>{fee.description || 'N/A'}</TableCell>
                  <TableCell>$ {fee.amount}</TableCell>
                  <TableCell>
                    {fee.status ? (
                      <span className='font-semibold text-green-600'>
                        Activo
                      </span>
                    ) : (
                      <span className='text-gray-400'>Inactivo</span>
                    )}
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
                              <Icons.userPen className='h-4 w-4' />
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
                              onClick={() => handleDelete(fee.feeId)}
                              disabled={deleteMutation.isPending}
                            >
                              <Icons.trash className='h-4 w-4 text-red-600' />
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
                <TableCell colSpan={4} className='h-24 text-center'>
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
      {/* Modal for edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>{editFee ? 'Editar cuota' : 'Nueva cuota'}</DialogTitle>
          <form onSubmit={handleSave} className='mt-2 space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Descripción
              </label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Monto ($)
              </label>
              <Input
                type='number'
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium'>Estado</label>
              <Switch
                checked={form.status}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, status: checked }))
                }
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>Año</label>
              <Input
                type='number'
                value={form.year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: Number(e.target.value) }))
                }
                required
              />
            </div>
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
        </DialogContent>
      </Dialog>
      {/* Modal for add */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogTitle>Añadir nueva cuota</DialogTitle>
          <form onSubmit={handleAdd} className='mt-2 space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>Nombre</label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <label className='mb-1 block text-sm font-medium'>
                Descripción
              </label>
              <Input
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Monto ($)
              </label>
              <Input
                type='number'
                value={addForm.amount}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium'>Estado</label>
              <Switch
                checked={addForm.status}
                onCheckedChange={(checked) =>
                  setAddForm((f) => ({ ...f, status: checked }))
                }
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>Año</label>
              <Input
                type='number'
                value={addForm.year}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, year: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setAddModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Añadiendo...' : 'Añadir'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
