import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
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
  const { neighborhoods, isLoading } = useNeighborhoodsStore((state) => state);
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
          className='flex w-full min-w-[110px] items-center justify-start'
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
        <div className='w-full min-w-[110px]'>
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
          className='flex w-full min-w-[120px] items-center justify-start'
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
        <div className='w-full min-w-[120px]'>{row.getValue('lastName')}</div>
      ),
      size: 120
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[120px] items-center justify-start'
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
        <p className='w-full min-w-[120px] text-left'>
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
          className='flex w-full min-w-[90px] items-center justify-start'
        >
          Fecha de nacimiento
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('birthDate');
        if (!date) return <div className='w-full min-w-[90px]'>-</div>;
        try {
          return (
            <div className='w-full min-w-[90px] text-right'>
              {new Date(date as string).toLocaleDateString('es-ES')}
            </div>
          );
        } catch (error) {
          return <div className='w-full min-w-[90px]'>Fecha inválida</div>;
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
          className='flex w-full min-w-[100px] items-center justify-start'
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
          <div className='w-full min-w-[100px]'>
            {isLoading ? (
              <Skeleton className='h-4 w-full' />
            ) : (
              <div className='w-full min-w-[100px]'>
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
          className='flex w-full min-w-[140px] items-center justify-start'
        >
          Email
        </Button>
      ),
      cell: ({ row }) => (
        <div className='w-full min-w-[140px]'>{row.getValue('email')}</div>
      ),
      size: 140
    },
    {
      accessorKey: 'status',
      enableSorting: true,
      header: () => (
        <Button
          variant='ghost'
          className='flex w-full min-w-[70px] items-center justify-start'
        >
          Estado
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as boolean;
        return (
          <Badge
            variant={status ? 'default' : 'destructive'}
            className='w-full min-w-[70px]'
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
        <div className='w-full min-w-[60px] text-right'>Acciones</div>
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
