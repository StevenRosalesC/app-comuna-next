import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Member } from '@/interfaces/members';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

interface MembersTableColumnsProps {
  actions: (member: Member) => React.ReactNode;
}

export function useMembersTableColumns({ actions }: MembersTableColumnsProps) {
  const columns: ColumnDef<Member>[] = [
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
      accessorKey: 'fullName',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[180px] items-center justify-start'
        >
          Nombre completo
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
        <span className='font-medium'>{row.getValue('fullName') || '-'}</span>
      ),
      size: 180
    },
    {
      accessorKey: 'houseNumber',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[80px] items-center justify-start'
        >
          N° Casa
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-1 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-1 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-1 h-4 w-4 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue('houseNumber') || '-'}</span>,
      size: 80
    },
    {
      accessorKey: 'joinDate',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[110px] items-center justify-start'
        >
          Fecha ingreso
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-1 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-1 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-1 h-4 w-4 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('joinDate');
        return date ? (
          new Date(date as string).toLocaleDateString('es-ES')
        ) : (
          <span>-</span>
        );
      },
      size: 110
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[80px] items-center justify-start'
        >
          Estado
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
        <Badge
          variant={
            row.getValue('status') === 'active' ? 'default' : 'destructive'
          }
          className='w-full min-w-[70px] text-center'
        >
          {row.getValue('status') === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
      size: 80
    },
    {
      accessorKey: 'documents',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[80px] items-center justify-start'
        >
          Documentos
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
        <Badge variant='outline' className='w-full min-w-[40px] text-center'>
          {row.getValue('documents') ?? 0}
        </Badge>
      ),
      size: 80
    },
    {
      accessorKey: 'annualFeePaid',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[100px] items-center justify-start'
        >
          Cuota anual
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
        <Badge
          variant={row.getValue('annualFeePaid') ? 'default' : 'destructive'}
          className='w-full min-w-[80px] text-center'
        >
          {row.getValue('annualFeePaid') ? 'Pagada' : 'Pendiente'}
        </Badge>
      ),
      size: 100
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => (
        <div className='w-full min-w-[60px] text-right'>Acciones</div>
      ),
      cell: ({ row }) => actions(row.original),
      size: 100
    }
  ];
  return columns;
}
