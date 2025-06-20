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
import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';
import { useDebounce } from './useDebounce';

interface SelectPersonWithRequirementsDialogProps {
  onSelect: (person: Person) => void;
  triggerLabel?: string;
}

export function SelectPersonWithRequirementsDialog({
  onSelect,
  triggerLabel = 'Seleccionar persona'
}: SelectPersonWithRequirementsDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const listRef = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 10;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['persons-with-reqs', debouncedSearch],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await personsService.getAllWithAllRequirementsApproved(
          {
            limit: PAGE_SIZE,
            offset: pageParam * PAGE_SIZE
          }
        );
        return {
          data: response.data || [],
          nextPage:
            response.data && response.data.length === PAGE_SIZE
              ? pageParam + 1
              : undefined
        };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage
    });

  // Scroll handler for infinite scroll
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const handleScroll = () => {
      if (
        list.scrollTop + list.clientHeight >= list.scrollHeight - 20 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    list.addEventListener('scroll', handleScroll);
    return () => list.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open]);

  const persons = (data?.pages || [])
    .flatMap((page) => page.data)
    .filter((person) => {
      const term = debouncedSearch.toLowerCase();
      return (
        person.firstName.toLowerCase().includes(term) ||
        person.lastName.toLowerCase().includes(term) ||
        person.identification.toLowerCase().includes(term)
      );
    });

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
          onChange={(e) => setSearch(e.target.value)}
          className='mb-2'
        />
        <div
          ref={listRef}
          style={{ maxHeight: 300, overflowY: 'auto' }}
          className='rounded border'
        >
          {isLoading && <div className='p-2 text-center'>Cargando...</div>}
          {!isLoading && persons.length === 0 && (
            <div className='p-2 text-center'>No se encontraron personas.</div>
          )}
          {!isLoading &&
            persons.map((person) => (
              <div
                key={person.personId}
                className='cursor-pointer p-2 hover:bg-muted'
                onClick={() => {
                  onSelect(person);
                  setOpen(false);
                }}
              >
                {person.firstName} {person.lastName} - {person.identification}
              </div>
            ))}
          {isFetchingNextPage && (
            <div className='p-2 text-center'>Cargando más...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
