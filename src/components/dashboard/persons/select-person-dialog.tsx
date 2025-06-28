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
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';

interface SelectPersonDialogProps {
  onSelect: (person: Person) => void;
  triggerLabel?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// Simple hook to detect mobile (tailwind sm: 640px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function SelectPersonDialog({
  onSelect,
  triggerLabel = 'Seleccionar persona'
}: SelectPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isMobile = useIsMobile();

  const { data, isLoading } = useQuery({
    queryKey: ['persons', search, page, pageSize],
    queryFn: async () => {
      const response = await personsService.getPersonsPaginated({
        pageParam: page,
        search,
        pageSize
      });
      return response;
    }
  });

  const persons = data?.data || [];
  const totalCount = data && 'count' in data ? (data as any).count : persons.length;
  const pageCount = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecciona una persona</DialogTitle>
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
        {/* Mobile: Cards, Desktop: Table */}
        {isMobile ? (
          <div className='space-y-2'>
            {isLoading ? (
              <div className='p-4 text-center text-muted-foreground'>Cargando...</div>
            ) : persons.length === 0 ? (
              <div className='p-4 text-center text-muted-foreground'>No se encontraron personas.</div>
            ) : (
              persons.map((person) => (
                <div
                  key={person.personId}
                  className='rounded border p-3 shadow-sm cursor-pointer hover:bg-muted transition-colors'
                  onClick={() => {
                    onSelect(person);
                    setOpen(false);
                  }}
                >
                  <div className='font-semibold'>{person.firstName} {person.lastName}</div>
                  <div className='text-xs text-muted-foreground'>Cédula: {person.identification}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className='rounded border overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase min-w-[120px]'>Nombre</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase min-w-[120px]'>Apellido</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase whitespace-nowrap min-w-[110px]'>Cédula</th>
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
                      <td className='px-4 py-2 break-words max-w-[140px]'>{person.firstName}</td>
                      <td className='px-4 py-2 break-words max-w-[140px]'>{person.lastName}</td>
                      <td className='px-4 py-2 whitespace-nowrap'>{person.identification}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
