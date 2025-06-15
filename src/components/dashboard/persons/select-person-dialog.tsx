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
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';
import { useDebounce } from '@/components/dashboard/users/useDebounce';

interface SelectPersonDialogProps {
  onSelect: (person: Person) => void;
  triggerLabel?: string;
}

export function SelectPersonDialog({
  onSelect,
  triggerLabel = 'Seleccionar persona'
}: SelectPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const listRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    // Clean the infinite query when the search changes to avoid duplicates
    queryClient.removeQueries({ queryKey: ['persons', debouncedSearch] });
    setDelayedLoading(true);
    const timer = setTimeout(() => setDelayedLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [debouncedSearch, queryClient]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['persons', debouncedSearch],
      queryFn: async ({ pageParam = 1 }) => {
        return personsService.getPersonsPaginated({
          pageParam,
          search: debouncedSearch,
          pageSize: 10
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage
    });

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
          onChange={(e) => setSearch(e.target.value)}
          className='mb-2'
        />
        <div
          ref={listRef}
          style={{ maxHeight: 300, overflowY: 'auto' }}
          className='rounded border'
          onScroll={() => {
            const list = listRef.current;
            if (
              list &&
              list.scrollTop + list.clientHeight >= list.scrollHeight - 20 &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              fetchNextPage();
            }
          }}
        >
          {(isLoading || delayedLoading) && (
            <div className='p-2 text-center'>Cargando...</div>
          )}
          {!isLoading &&
            !delayedLoading &&
            data?.pages
              .flatMap((page) => (page as any)?.data ?? [])
              .map((person: Person) => (
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
