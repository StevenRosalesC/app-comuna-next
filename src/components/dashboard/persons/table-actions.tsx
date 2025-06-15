import { Pencil, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Person } from '@/interfaces/persons';
import { isAdult } from '@/utils/persons';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface TableActionsProps {
  person: Person;
  onEdit: (person: Person) => void;
  onViewRequirements: (person: Person) => void;
}

export function TableActions({
  person,
  onEdit,
  onViewRequirements
}: TableActionsProps) {
  const canApprove = usePermission(ValidModules.PERSONS, [
    ValidActions.APPROVE_REQUIREMENTS
  ]);
  const canEdit = usePermission(ValidModules.PERSONS, [ValidActions.UPDATE]);
  return (
    <div className='flex items-center justify-end gap-2'>
      {canEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' onClick={() => onEdit(person)}>
              <Pencil className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>
      )}
      {canApprove && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onViewRequirements(person)}
              disabled={!person.status || !isAdult(new Date(person.birthDate))}
            >
              <LayoutList className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver requisitos</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
