import {
  useReactTable,
  getCoreRowModel,
  SortingState
} from '@tanstack/react-table';
import { useMembersTableColumns } from './members-table-columns';
import { Member } from '@/interfaces/members';
import React from 'react';
import { Eye } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';

interface UseMembersTableProps {
  data: Member[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (member: Member) => void;
  onView: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function useMembersTable({
  data,
  sorting,
  onSortingChange,
  onEdit,
  onView,
  onDelete
}: UseMembersTableProps) {
  const columns = useMembersTableColumns({
    actions: (member: Member) => (
      <div className='flex items-center justify-end gap-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className='text-blue-600 hover:underline'
              title='Ver'
              onClick={() => onView(member)}
            >
              <Eye className='h-4 w-4' />
            </button>
          </TooltipTrigger>
          <TooltipContent>Ver comunero</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className='text-yellow-600 hover:underline'
              title='Editar'
              onClick={() => onEdit(member)}
            >
              <Pencil className='h-4 w-4' />
            </button>
          </TooltipTrigger>
          <TooltipContent>Editar comunero</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className='text-red-600 hover:underline'
              title='Eliminar'
              onClick={() => onDelete(member)}
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </TooltipTrigger>
          <TooltipContent>Eliminar comunero</TooltipContent>
        </Tooltip>
      </div>
    )
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        onSortingChange(newSorting);
      } else {
        onSortingChange(updater);
      }
    },
    manualSorting: true
  });

  return { table, columns };
}
