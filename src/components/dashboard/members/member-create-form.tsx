'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createMember } from '@/services/members';
import { Person } from '@/interfaces/persons';
import { SelectPersonWithRequirementsDialog } from '@/components/dashboard/persons/select-person-with-requirements-dialog';

export default function MemberCreateForm() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseNumber, setHouseNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson) {
      toast.error('Selecciona una persona');
      return;
    }
    setLoading(true);
    try {
      await createMember({
        personId: selectedPerson.personId,
        houseNumber
      });
      toast.success('Comunero creado exitosamente');
      setSelectedPerson(null);
      setHouseNumber('');
    } catch (error) {
      toast.error('Error al crear comunero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <SelectPersonWithRequirementsDialog
          onSelect={setSelectedPerson}
          triggerLabel={
            selectedPerson
              ? `${selectedPerson.firstName} ${selectedPerson.lastName} (${selectedPerson.identification})`
              : 'Seleccionar persona'
          }
        />
        {selectedPerson && (
          <div className='mt-2 text-sm text-muted-foreground'>
            <div>
              <b>Nombre:</b> {selectedPerson.firstName}{' '}
              {selectedPerson.lastName}
            </div>
            <div>
              <b>Cédula:</b> {selectedPerson.identification}
            </div>
            <div>
              <b>Email:</b> {selectedPerson.email || 'Sin email'}
            </div>
          </div>
        )}
        {!selectedPerson && (
          <div className='mt-2 text-xs text-red-500'>
            Debes seleccionar una persona para crear el comunero.
          </div>
        )}
      </div>
      <div>
        <label className='mb-1 block text-sm font-medium'>Número de casa</label>
        <Input
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          placeholder='Ej: 123'
        />
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={loading || !selectedPerson}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
