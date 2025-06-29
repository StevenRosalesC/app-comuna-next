'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';

interface SelectPersonWithRequirementsDialogProps {
  onSelect: (person: Person) => void;
  triggerLabel?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function SelectPersonWithRequirementsDialog({
  onSelect,
  triggerLabel = 'Seleccionar persona'
}: SelectPersonWithRequirementsDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['persons-with-reqs', search, page, pageSize],
    queryFn: async () => {
      const response = await personsService.getAllWithAllRequirementsApproved({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search
      });
      return response;
    }
  });

  const persons = data?.data || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Selecciona una persona (con requisitos aprobados)
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder='Buscar persona...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='mb-2'
        />
        {/* Page size selector */}
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>Resultados por página:</span>
          <select
            className='border rounded px-2 py-1 text-sm'
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className='rounded border'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase'>Nombre</th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase'>Apellido</th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase'>Cédula</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className='p-4 text-center text-muted-foreground'>Cargando...</td>
                </tr>
              ) : persons.length === 0 ? (
                <tr>
                  <td colSpan={3} className='p-4 text-center text-muted-foreground'>No se encontraron personas.</td>
                </tr>
              ) : (
                persons.map((person) => (
                  <tr
                    key={person.personId}
                    className='cursor-pointer hover:bg-muted transition-colors'
                    onClick={() => {
                      onSelect(person);
                      setOpen(false);
                    }}
                  >
                    <td className='px-4 py-2'>{person.firstName}</td>
                    <td className='px-4 py-2'>{person.lastName}</td>
                    <td className='px-4 py-2'>{person.identification}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className='mt-4 flex items-center justify-between'>
          <div className='text-xs text-muted-foreground'>
            Página {page} de {pageCount} ({totalCount} personas)
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount || pageCount === 0}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
