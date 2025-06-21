import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '@/interfaces/users';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

interface UsersTableColumnsProps {
  actions: (user: User) => React.ReactNode;
}

export function useUsersTableColumns({ actions }: UsersTableColumnsProps) {
  const columns: ColumnDef<User>[] = [
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
      accessorKey: 'username',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[120px] items-center justify-start'
        >
          Usuario
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
        <div className='w-full min-w-[120px]'>{row.getValue('username')}</div>
      ),
      size: 120
    },
    {
      accessorFn: (row) => row.person?.email,
      id: 'email',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[140px] items-center justify-start'
        >
          Email
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
        <div className='w-full min-w-[140px]'>
          {row.original.person?.email || '-'}
        </div>
      ),
      size: 140
    },
    {
      accessorFn: (row) => row.userRoles?.name,
      id: 'role',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='flex w-full min-w-[100px] items-center justify-start'
        >
          Rol
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
        <div className='w-full min-w-[100px]'>
          {row.original.userRoles?.name || '-'}
        </div>
      ),
      size: 100
    },
    {
      accessorKey: 'status',
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
        const user = row.original;
        return (
          <div className='flex items-center justify-end gap-2'>
            {actions(user)}
          </div>
        );
      },
      size: 60
    }
  ];
  return columns;
}
