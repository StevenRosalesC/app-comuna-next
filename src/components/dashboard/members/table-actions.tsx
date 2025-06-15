import { Button } from '@/components/ui/button';
import { Member } from '@/interfaces/members';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface TableActionsProps {
  member: Member;
  onEdit: (member: Member) => void;
  onView: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export function TableActions({
  member,
  onEdit,
  onView,
  onDelete
}: TableActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => onView(member)}
        title='Ver'
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => onEdit(member)}
        title='Editar'
      >
        <Pencil className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => onDelete(member)}
        title='Eliminar'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}
