import { Input } from '@/components/ui/input';
import PersonsActionsSection from './personsActionsSection';

interface PersonsTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function PersonsTableToolbar({
  search,
  onSearchChange
}: PersonsTableToolbarProps) {
  return (
    <div className='mb-4 flex w-full flex-row items-center justify-between gap-2'>
      <Input
        placeholder='Buscar persona'
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className='max-w-sm'
      />
      <PersonsActionsSection />
    </div>
  );
}
