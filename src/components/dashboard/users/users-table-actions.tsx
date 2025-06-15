import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { User } from '@/interfaces/users';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface UsersTableActionsProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UsersTableActions({ user, onEdit }: UsersTableActionsProps) {
  const { permissions } = usePermissionsStore();
  const canUpdateUser = permissions?.[ValidModules.USERS]?.includes(
    ValidActions.UPDATE
  );
  return (
    <div className='flex items-center justify-end gap-2'>
      {canUpdateUser && (
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
      )}
    </div>
  );
}
