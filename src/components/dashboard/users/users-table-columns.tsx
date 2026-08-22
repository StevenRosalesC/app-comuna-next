'use client';

import { ArrowUpDown, ArrowUp, ArrowDown, Shield, Mail, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/interfaces/users';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

interface UsersTableColumnsProps {
  actions: (user: User) => React.ReactNode;
}

function getInitials(name: string, lastName?: string): string {
  const first = name ? name.charAt(0).toUpperCase() : '';
  const second = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${second}` || 'U';
}

export function useUsersTableColumns({ actions }: UsersTableColumnsProps) {
  const columns: ColumnDef<User>[] = [
    {
      id: 'selection',
      header: ({ table }) => (
        <div className='flex items-center justify-center px-2'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Seleccionar todas las filas'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Seleccionar fila'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-3 h-8 data-[state=open]:bg-accent font-semibold text-xs'
        >
          <span>Usuario</span>
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-3.5 w-3.5' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-3.5 w-3.5' />
          ) : (
            <ArrowUpDown className='ml-2 h-3.5 w-3.5 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const firstName = user.person?.firstName || '';
        const lastName = user.person?.lastName || '';
        const initials = getInitials(firstName || user.username, lastName);

        return (
          <div className='flex items-center gap-3 py-1'>
            <Avatar className='h-9 w-9 border'>
              <AvatarFallback className='bg-primary/10 text-primary text-xs font-bold'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-semibold text-sm leading-tight text-foreground'>
                {user.username}
              </span>
              {firstName || lastName ? (
                <span className='text-xs text-muted-foreground'>
                  {firstName} {lastName}
                </span>
              ) : null}
            </div>
          </div>
        );
      }
    },
    {
      accessorFn: (row) => row.person?.identification,
      id: 'identification',
      header: ({ column }) => (
        <div className='font-semibold text-xs'>Cédula</div>
      ),
      cell: ({ row }) => {
        const id = row.original.person?.identification;
        if (!id) return <span className='text-xs text-muted-foreground'>-</span>;
        return (
          <div className='flex items-center gap-1.5 font-mono text-xs'>
            <IdCard className='h-3.5 w-3.5 text-muted-foreground' />
            <span>{id}</span>
          </div>
        );
      }
    },
    {
      accessorFn: (row) => row.person?.email,
      id: 'email',
      header: ({ column }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-3 h-8 data-[state=open]:bg-accent font-semibold text-xs'
        >
          <span>Email</span>
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-3.5 w-3.5' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-3.5 w-3.5' />
          ) : (
            <ArrowUpDown className='ml-2 h-3.5 w-3.5 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const email = row.original.person?.email;
        if (!email) return <span className='text-xs text-muted-foreground'>-</span>;
        return (
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Mail className='h-3.5 w-3.5 shrink-0' />
            <span className='truncate max-w-[200px]'>{email}</span>
          </div>
        );
      }
    },
    {
      accessorFn: (row) => row.role?.name,
      id: 'role',
      header: ({ column }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-3 h-8 data-[state=open]:bg-accent font-semibold text-xs'
        >
          <span>Rol</span>
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2 h-3.5 w-3.5' />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className='ml-2 h-3.5 w-3.5' />
          ) : (
            <ArrowUpDown className='ml-2 h-3.5 w-3.5 opacity-50' />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const roleName = row.original.role?.name;
        if (!roleName) return <span className='text-xs text-muted-foreground'>Sin rol</span>;
        return (
          <Badge variant='outline' className='flex w-fit items-center gap-1 font-medium bg-muted/50'>
            <Shield className='h-3 w-3 text-muted-foreground' />
            <span>{roleName}</span>
          </Badge>
        );
      }
    },
    {
      accessorKey: 'status',
      header: () => <div className='font-semibold text-xs'>Estado</div>,
      cell: ({ row }) => {
        const status = row.getValue('status') as boolean;
        return (
          <div className='flex items-center gap-2'>
            <span
              className={`h-2 w-2 rounded-full ${
                status ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-zinc-400 dark:bg-zinc-600'
              }`}
            />
            <span className={`text-xs font-medium ${status ? 'text-foreground' : 'text-muted-foreground'}`}>
              {status ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => (
        <div className='text-right font-semibold text-xs pr-2'>Acciones</div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex items-center justify-end gap-1 pr-2'>
            {actions(user)}
          </div>
        );
      }
    }
  ];
  return columns;
}
