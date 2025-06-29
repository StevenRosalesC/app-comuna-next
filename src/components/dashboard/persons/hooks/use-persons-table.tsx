import {
  useReactTable,
  getCoreRowModel,
  SortingState
} from '@tanstack/react-table';
import { usePersonsTableColumns } from '../persons-table-columns';
import { Person } from '@/interfaces/persons';
import { TableActions } from '../table-actions';
import React from 'react';

interface UsePersonsTableProps {
  data: Person[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (person: Person) => void;
  onViewRequirements: (person: Person) => void;
}

export function usePersonsTable({
  data,
  sorting,
  onSortingChange,
  onEdit,
  onViewRequirements
}: UsePersonsTableProps) {
  const columns = usePersonsTableColumns({
    actions: (person: Person) => (
      <TableActions
        person={person}
        onEdit={onEdit}
        onViewRequirements={onViewRequirements}
      />
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
