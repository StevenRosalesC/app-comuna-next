import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Person } from '@/interfaces/persons';
import { ColumnDef } from '@tanstack/react-table';
import { useNeighborhoodsStore } from '@/hooks/store/useNeighborhoodsStore';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface PersonsTableColumnsProps {
  actions: (person: Person) => React.ReactNode;
}

export function usePersonsTableColumns({ actions }: PersonsTableColumnsProps) {
  const neighborhoods = useNeighborhoodsStore((state) => state.neighborhoods);
  const isLoading = useNeighborhoodsStore((state) => state.isLoading);
  const columns: ColumnDef<Person>[] = [
    {
      id: 'selection',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Seleccionar todas las filas'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Seleccionar fila'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32
    },
    {
      accessorKey: 'identification',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-27.5 items-center justify-start'
        >
          Cédula
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-1 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-1 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-1 h-4 w-4 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className='w-full min-w-27.5'>
          {row.getValue('identification')}
        </div>
      ),
      size: 110
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-30 items-center justify-start'
        >
          Apellidos
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-1 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-1 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-1 h-4 w-4 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className='w-full min-w-30'>{row.getValue('lastName')}</div>
      ),
      size: 120
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-30 items-center justify-start'
        >
          Nombres
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-1 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-1 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-1 h-4 w-4 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <p className='w-full min-w-30 text-left'>
          {row.getValue('firstName')}
        </p>
      ),
      size: 120
    },
    {
      accessorKey: 'birthDate',
      enableSorting: true,
      header: () => (
        <Button
          variant='ghost'
          className='flex w-full min-w-22.5 items-center justify-start'
        >
          Fecha de nacimiento
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('birthDate');
        if (!date) return <div className='w-full min-w-22.5'>-</div>;
        try {
          return (
            <div className='w-full min-w-22.5 text-right'>
              {new Date(date as string).toLocaleDateString('es-ES')}
            </div>
          );
        } catch (error) {
          return <div className='w-full min-w-22.5'>Fecha inválida</div>;
        }
      },
      size: 90
    },
    {
      accessorKey: 'neighborhoodId',
      enableSorting: false,
      header: () => (
        <Button
          variant='ghost'
          className='flex w-full min-w-25 items-center justify-start'
        >
          Barrio
        </Button>
      ),
      cell: ({ row }) => {
        const neighborhoodId = row.getValue('neighborhoodId') as string;
        const neighborhood = neighborhoods?.find(
          (n) => n.neighborhoodId === neighborhoodId
        );
        return (
          <div className='w-full min-w-25'>
            {isLoading ? (
              <Skeleton className='h-4 w-full' />
            ) : (
              <div className='w-full min-w-25'>
                {neighborhood?.neighborhoodName ?? '-'}
              </div>
            )}
          </div>
        );
      },
      size: 100
    },
    {
      accessorKey: 'email',
      enableSorting: false,
      header: () => (
        <Button
          variant='ghost'
          className='flex w-full min-w-35 items-center justify-start'
        >
          Email
        </Button>
      ),
      cell: ({ row }) => (
        <div className='w-full min-w-35'>{row.getValue('email')}</div>
      ),
      size: 140
    },
    {
      accessorKey: 'status',
      enableSorting: true,
      header: () => (
        <Button
          variant='ghost'
          className='flex w-full min-w-17.5 items-center justify-start'
        >
          Estado
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as boolean;
        return (
          <Badge
            variant={status ? 'default' : 'destructive'}
            className='w-full min-w-17.5'
          >
            {status ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
      size: 70
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => (
        <div className='w-full min-w-15 text-right'>Acciones</div>
      ),
      cell: ({ row }) => {
        const person = row.original;
        return (
          <div className='flex items-center justify-end gap-2'>
            {actions(person)}
          </div>
        );
      },
      size: 60
    }
  ];
  return columns;
}
