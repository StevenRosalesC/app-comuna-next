import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { User } from '@/interfaces/users';

interface UsersTableActionsProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UsersTableActions({ user, onEdit }: UsersTableActionsProps) {
  return (
    <div className='flex items-center justify-end gap-2'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' onClick={() => onEdit(user)}>
            <Pencil className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editar</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
