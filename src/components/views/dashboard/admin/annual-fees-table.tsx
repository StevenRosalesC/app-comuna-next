'use client';
import React, { useState } from 'react';
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

export default function AnnualFeesTable() {
  const queryClient = useQueryClient();
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
    status: true
  });

  const {
    data: annualFees = [],
    isLoading,
    isError
  } = useQuery<AnnualFee[]>({
    queryKey: ['annualFees'],
    queryFn: getAnnualFees
  });

  const createMutation = useMutation({
    mutationFn: createAnnualFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annualFees'] });
      toast.success('Cuota añadida correctamente');
      setAddModalOpen(false);
      setAddForm({
        description: '',
        amount: 0,
        status: true
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
    onError: () => {
      toast.error('Error al eliminar la cuota');
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
            status: fee.status
          }
        : {
            description: '',
            amount: 0,
            status: true
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

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar las cuotas anuales.</div>;
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Cuotas anuales</h2>
        <Button onClick={() => setAddModalOpen(true)}>+ Nueva cuota</Button>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto ($)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {annualFees.length > 0 ? (
              annualFees.map((fee) => (
                <TableRow key={fee.feeId}>
                  <TableCell>{fee.description}</TableCell>
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
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => openModal(fee)}
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
                            onClick={() => handleDelete(fee.feeId)}
                            disabled={deleteMutation.isPending}
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
                  No hay cuotas anuales registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                min={0}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='block text-sm font-medium'>Estado</label>
              <Switch
                checked={form.status}
                onCheckedChange={(v) => setForm((f) => ({ ...f, status: v }))}
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
          <DialogTitle>Nueva cuota</DialogTitle>
          <form onSubmit={handleAdd} className='mt-2 space-y-4'>
            <div>
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
                min={0}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='block text-sm font-medium'>Estado</label>
              <Switch
                checked={addForm.status}
                onCheckedChange={(v) =>
                  setAddForm((f) => ({ ...f, status: v }))
                }
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
                {createMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
