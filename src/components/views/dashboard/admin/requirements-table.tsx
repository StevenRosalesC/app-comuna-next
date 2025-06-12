'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useRequirementsStore } from '@/hooks/store/useRequirementsStore';
import { Requirement } from '@/interfaces/requirements';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
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

const formSchema = z.object({
  requirement: z.string().min(1, { message: 'Requisito es requerido' }),
  observation: z.string().min(1, { message: 'Observación es requerida' }).default('Ninguna'),
  status: z.boolean().default(true)
});

type FormValue = z.infer<typeof formSchema>;


export default function RequirementsTable() {
  const { requirements, loading, addRequirement, error, editRequirement, deleteRequirement, fetchRequirements } = useRequirementsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editReq, setEditReq] = useState<Requirement | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<FormValue>({ requirement: '', observation: 'Ninguna', status: true });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReq, setDeleteReq] = useState<Requirement | null>(null);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { requirement: '', observation: 'Ninguna', status: true }
  });

  // Open modal for edit
  const openModal = (req: Requirement | null = null) => {
    setEditReq(req);
    form.reset(req ? { requirement: req.requirement, observation: req.observation, status: req.status } : { requirement: '', observation: '', status: true });
    setModalOpen(true);
  };

  // Save requirement (edit)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editReq) {
      toast.promise(editRequirement(editReq.requirementId, form.getValues()), {
        loading: 'Actualizando requisito...',
        success: 'Requisito actualizado correctamente',
        error: 'Error al actualizar el requisito'
      });
    }
    setModalOpen(false);
  };

  // Delete requirement
  const handleDelete = async (id: string) => {
    toast.promise(deleteRequirement(id), {
      loading: 'Eliminando requisito...',
      success: 'Requisito eliminado correctamente',
      error: 'Error al eliminar el requisito'
    });
    setDeleteModalOpen(false);
  };

  // Add requirement
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      toast.promise(addRequirement(form.getValues()), {
        loading: 'Añadiendo requisito...',
        success: 'Requisito añadido correctamente',
        error: 'Error al añadir el requisito'
      });
      setAddModalOpen(false);
      form.reset();
    } catch {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Requisitos para ser comunero</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors">
          + Nuevo requisito
        </button>
      </div>
      {loading ? (
        <DataTableSkeleton columnCount={4} rowCount={6} />
      ) : (
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/2">Requisito</TableHead>
              <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/2">Observación</TableHead>
              <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Estado</TableHead>
              <TableHead className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {requirements.map((req) => (
              <TableRow key={req.requirementId}>
                <TableCell className="px-4 py-2">{req.requirement}</TableCell>
                <TableCell className="px-4 py-2">{req.observation}</TableCell>
                <TableCell className="px-4 py-2">
                  {req.status ? (
                    <span className="text-green-600 font-semibold">Activo</span>
                  ) : (
                    <span className="text-gray-400">Inactivo</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-2 text-right flex gap-2 justify-end">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-blue-600 hover:text-blue-800 p-1" onClick={() => openModal(req)} aria-label="Editar">
                          <Icons.userPen className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-red-600 hover:text-red-800 p-1" onClick={() => { setDeleteReq(req); setDeleteModalOpen(true); }} aria-label="Eliminar">
                          <Icons.trash className="w-5 h-5" />
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
          <DialogTitle>{editReq ? 'Editar requisito' : 'Nuevo requisito'}</DialogTitle>
          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="requirement"
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
                name="observation"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />

                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Modal for add */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogTitle>Nuevo requisito</DialogTitle>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input
                value={addForm.requirement}
                onChange={e => setAddForm(f => ({ ...f, requirement: e.target.value }))}
                required
              />
              <label className="block text-sm font-medium mb-1">Observación</label>
              <Input
                value={addForm.observation}
                onChange={e => setAddForm(f => ({ ...f, observation: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium">Obligatorio</label>
              <Switch
                checked={addForm.status}
                onCheckedChange={v => setAddForm(f => ({ ...f, status: v }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Botón flotante para nuevo requisito */}
      <button
        className="fixed bottom-8 right-8 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        onClick={() => setAddModalOpen(true)}
        aria-label="Agregar nuevo requisito"
      >
        +
      </button>
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDelete(deleteReq?.requirementId || '')}
        loading={loading}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer."
      />
    </>
  );
} 