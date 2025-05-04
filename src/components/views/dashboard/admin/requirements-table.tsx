'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useRequirementsStore, Requirement } from '@/hooks/store/useRequirementsStore';

export default function RequirementsTable() {
  const { requirements, addRequirement, editRequirement, deleteRequirement } = useRequirementsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editReq, setEditReq] = useState<Requirement | null>(null);
  const [form, setForm] = useState<{ description: string; mandatory: boolean }>({ description: '', mandatory: true });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<{ description: string; mandatory: boolean }>({ description: '', mandatory: true });

  // Open modal for edit
  const openModal = (req: Requirement | null = null) => {
    setEditReq(req);
    setForm(req ? { description: req.description, mandatory: req.mandatory } : { description: '', mandatory: true });
    setModalOpen(true);
  };

  // Save requirement (edit)
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editReq) {
      editRequirement(editReq.id, form);
    }
    setModalOpen(false);
  };

  // Delete requirement
  const handleDelete = (id: number) => {
    deleteRequirement(id);
  };

  // Add requirement
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRequirement(addForm);
    setAddModalOpen(false);
    setAddForm({ description: '', mandatory: true });
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requisito</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Obligatorio</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requirements.map((req) => (
            <tr key={req.id}>
              <td className="px-4 py-2">{req.description}</td>
              <td className="px-4 py-2">
                {req.mandatory ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
              <td className="px-4 py-2 text-right">
                {/* Actions: edit/delete */}
                <button className="text-blue-600 hover:underline mr-2" onClick={() => openModal(req)}>Editar</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(req.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>{editReq ? 'Editar requisito' : 'Nuevo requisito'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium">Obligatorio</label>
              <Switch
                checked={form.mandatory}
                onCheckedChange={v => setForm(f => ({ ...f, mandatory: v }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
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
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium">Obligatorio</label>
              <Switch
                checked={addForm.mandatory}
                onCheckedChange={v => setAddForm(f => ({ ...f, mandatory: v }))}
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
    </>
  );
} 