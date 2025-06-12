'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAnnualFeesStore, AnnualFee } from '@/hooks/store/useAnnualFeesStore';
import { toast } from 'sonner';

export default function AnnualFeesTable() {
  const { annualFees, addAnnualFee, editAnnualFee, deleteAnnualFee } = useAnnualFeesStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editFee, setEditFee] = useState<AnnualFee | null>(null);
  const [form, setForm] = useState<{ year: number; description: string; amount: number; mandatory: boolean }>({ year: new Date().getFullYear(), description: '', amount: 0, mandatory: true });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<{ year: number; description: string; amount: number; mandatory: boolean }>({ year: new Date().getFullYear(), description: '', amount: 0, mandatory: true });

  // Open modal for edit
  const openModal = (fee: AnnualFee | null = null) => {
    setEditFee(fee);
    setForm(fee ? { year: fee.year, description: fee.description, amount: fee.amount, mandatory: fee.mandatory } : { year: new Date().getFullYear(), description: '', amount: 0, mandatory: true });
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
    setAddForm({ year: new Date().getFullYear(), description: '', amount: 0, mandatory: true });
    toast.success('Cuota añadida correctamente');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Cuotas anuales</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors">
          + Nueva cuota
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto (S/.)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Obligatorio</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {annualFees.map((fee) => (
            <tr key={fee.id}>
              <td className="px-4 py-2">{fee.year}</td>
              <td className="px-4 py-2">{fee.description}</td>
              <td className="px-4 py-2">S/. {fee.amount}</td>
              <td className="px-4 py-2">
                {fee.mandatory ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </td>
              <td className="px-4 py-2 text-right">
                {/* Actions: edit/delete */}
                <button className="text-blue-600 hover:underline mr-2" onClick={() => openModal(fee)}>Editar</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(fee.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>{editFee ? 'Editar cuota' : 'Nueva cuota'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Año</label>
              <Input
                type="number"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                required
                min={2000}
                max={2100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto (S/.)</label>
              <Input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                required
                min={0}
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
          <DialogTitle>Nueva cuota</DialogTitle>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Año</label>
              <Input
                type="number"
                value={addForm.year}
                onChange={e => setAddForm(f => ({ ...f, year: Number(e.target.value) }))}
                required
                min={2000}
                max={2100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto (S/.)</label>
              <Input
                type="number"
                value={addForm.amount}
                onChange={e => setAddForm(f => ({ ...f, amount: Number(e.target.value) }))}
                required
                min={0}
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
    </>
  );
} 