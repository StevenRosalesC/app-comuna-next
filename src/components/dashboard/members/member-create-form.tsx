'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createMember } from '@/services/members';
import { Person } from '@/interfaces/persons';
import { Switch } from '@/components/ui/switch';
import { SelectPersonWithRequirementsDialog } from '@/components/dashboard/persons/select-person-with-requirements-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

export default function MemberCreateForm() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseNumber, setHouseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasHouseNumber, setHasHouseNumber] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson) {
      toast.error('Selecciona una persona');
      return;
    }
    if (hasHouseNumber && !houseNumber.trim()) {
      toast.error('Ingresa el número de casa');
      return;
    }
    setLoading(true);
    try {
      await createMember({
        personId: selectedPerson.personId,
        houseNumber: hasHouseNumber ? houseNumber.trim() : undefined
      });
      toast.success('Comunero creado exitosamente');
      setSelectedPerson(null);
      setHouseNumber('');
      setHasHouseNumber(false);
    } catch (error) {
      toast.error('Error al crear comunero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-1'>
            <CardTitle>Crear comunero</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Selecciona una persona y registra su información como comunero.
            </p>
          </div>
          <Badge variant={selectedPerson ? 'default' : 'secondary'}>
            {selectedPerson ? 'Persona seleccionada' : 'Pendiente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <SelectPersonWithRequirementsDialog
              onSelect={setSelectedPerson}
              triggerLabel={
                selectedPerson
                  ? `${selectedPerson.firstName} ${selectedPerson.lastName} (${selectedPerson.identification})`
                  : 'Seleccionar persona'
              }
            />

            {!selectedPerson ? (
              <Alert>
                <Info className='h-4 w-4' />
                <AlertTitle>Selecciona una persona</AlertTitle>
                <AlertDescription>
                  El botón Guardar se habilita cuando selecciones una persona.
                </AlertDescription>
              </Alert>
            ) : (
              <div className='rounded-lg border bg-muted/30 p-3'>
                <div className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-3'>
                  <div>
                    <div className='text-xs text-muted-foreground'>Nombre</div>
                    <div className='font-medium'>
                      {selectedPerson.firstName} {selectedPerson.lastName}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-muted-foreground'>Cédula</div>
                    <div className='font-medium'>
                      {selectedPerson.identification}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-muted-foreground'>Email</div>
                    <div className='font-medium'>
                      {selectedPerson.email || 'Sin email'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='rounded-lg border p-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={hasHouseNumber}
                  onCheckedChange={(checked) => {
                    setHasHouseNumber(checked);
                    if (!checked) setHouseNumber('');
                  }}
                />
                <div>
                  <div className='text-sm font-medium'>Número de casa</div>
                  <div className='text-xs text-muted-foreground'>
                    Actívalo si el comunero tiene número de casa asignado.
                  </div>
                </div>
              </div>

              <div className='w-full sm:max-w-[240px]'>
                <Label className='sr-only' htmlFor='houseNumber'>
                  Número de casa
                </Label>
                <Input
                  id='houseNumber'
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder='Ej: 123'
                  disabled={!hasHouseNumber}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={loading || !selectedPerson}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
