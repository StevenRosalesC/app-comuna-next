'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  useAnnualFeesStore,
  AnnualFee
} from '@/hooks/store/useAnnualFeesStore';
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

export default function AnnualFeesTable() {
  const { annualFees, addAnnualFee, editAnnualFee, deleteAnnualFee } =
    useAnnualFeesStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editFee, setEditFee] = useState<AnnualFee | null>(null);
  const [form, setForm] = useState<{
    year: number;
    description: string;
    amount: number;
    mandatory: boolean;
  }>({
    year: new Date().getFullYear(),
    description: '',
    amount: 0,
    mandatory: true
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<{
    year: number;
    description: string;
    amount: number;
    mandatory: boolean;
  }>({
    year: new Date().getFullYear(),
    description: '',
    amount: 0,
    mandatory: true
  });

  // Open modal for edit
  const openModal = (fee: AnnualFee | null = null) => {
    setEditFee(fee);
    setForm(
      fee
        ? {
            year: fee.year,
            description: fee.description,
            amount: fee.amount,
            mandatory: fee.mandatory
          }
        : {
            year: new Date().getFullYear(),
            description: '',
            amount: 0,
            mandatory: true
          }
    );
    setModalOpen(true);
  };

  // Save annual fee (edit)
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editFee) {
      editAnnualFee(editFee.id, form);
      toast.success('Cuota actualizada correctamente');
    }
    setModalOpen(false);
  };

  // Delete annual fee
  const handleDelete = (id: number) => {
    deleteAnnualFee(id);
    toast.success('Cuota eliminada');
  };

  // Add annual fee
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAnnualFee(addForm);
    setAddModalOpen(false);
    setAddForm({
      year: new Date().getFullYear(),
      description: '',
      amount: 0,
      mandatory: true
    });
    toast.success('Cuota añadida correctamente');
  };

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
              <TableHead>Año</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto (S/.)</TableHead>
              <TableHead>Obligatorio</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {annualFees.length > 0 ? (
              annualFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.year}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell>S/. {fee.amount}</TableCell>
                  <TableCell>
                    {fee.mandatory ? (
                      <span className='font-semibold text-green-600'>Sí</span>
                    ) : (
                      <span className='text-gray-400'>No</span>
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
                            onClick={() => handleDelete(fee.id)}
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
                <TableCell colSpan={5} className='h-24 text-center'>
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
              <label className='mb-1 block text-sm font-medium'>Año</label>
              <Input
                type='number'
                value={form.year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: Number(e.target.value) }))
                }
                required
                min={2000}
                max={2100}
              />
            </div>
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
                Monto (S/.)
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
              <label className='block text-sm font-medium'>Obligatorio</label>
              <Switch
                checked={form.mandatory}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, mandatory: v }))
                }
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
              <Button type='submit'>Guardar</Button>
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
              <label className='mb-1 block text-sm font-medium'>Año</label>
              <Input
                type='number'
                value={addForm.year}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, year: Number(e.target.value) }))
                }
                required
                min={2000}
                max={2100}
              />
            </div>
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
                Monto (S/.)
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
              <label className='block text-sm font-medium'>Obligatorio</label>
              <Switch
                checked={addForm.mandatory}
                onCheckedChange={(v) =>
                  setAddForm((f) => ({ ...f, mandatory: v }))
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
              <Button type='submit'>Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
