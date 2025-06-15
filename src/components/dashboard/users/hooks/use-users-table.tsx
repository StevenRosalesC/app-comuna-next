import {
  useReactTable,
  getCoreRowModel,
  SortingState
} from '@tanstack/react-table';
import { useUsersTableColumns } from '../users-table-columns';
import { User } from '@/interfaces/users';
import React from 'react';
import { UsersTableActions } from '../users-table-actions';
interface UseUsersTableProps {
  data: User[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onEdit: (user: User) => void;
}

export function useUsersTable({
  data,
  sorting,
  onSortingChange,
  onEdit
}: UseUsersTableProps) {
  const columns = useUsersTableColumns({
    actions: (user: User) => <UsersTableActions user={user} onEdit={onEdit} />
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
