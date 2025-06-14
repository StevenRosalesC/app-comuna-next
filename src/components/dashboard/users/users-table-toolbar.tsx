import { Input } from '@/components/ui/input';
import UsersActionsSelection from './users-actions-selection';

interface UsersTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function UsersTableToolbar({
  search,
  onSearchChange
}: UsersTableToolbarProps) {
  return (
    <div className='mb-4 flex w-full flex-row items-center justify-between gap-2'>
      <Input
        placeholder='Buscar persona'
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className='max-w-sm'
      />
      <UsersActionsSelection />
    </div>
  );
}
