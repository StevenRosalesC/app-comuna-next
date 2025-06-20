import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { flexRender, SortingState } from '@tanstack/react-table';
import { PersonsTableSkeleton } from './persons-table-skeleton';
import { Person } from '@/interfaces/persons';
import { PersonEditDialog } from './person-edit-dialog';
import { useState } from 'react';
import { usePersonsTable } from './hooks/use-persons-table';
import { ApproveRequirementsDialog } from './approve-requirements-dialog';

interface PersonsTableProps {
  data: Person[];
  isLoading: boolean;
  pageSize: number;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  updatePerson: (person: Person) => void;
}

export function PersonsTable({
  data,
  isLoading,
  pageSize,
  sorting,
  onSortingChange,
  updatePerson
}: PersonsTableProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [approveRequirementsDialogOpen, setApproveRequirementsDialogOpen] =
    useState(false);
  const { table, columns } = usePersonsTable({
    data,
    sorting,
    onSortingChange,
    onEdit: (person: Person) => {
      setSelectedPerson(person);
      setEditDialogOpen(true);
    },
    onViewRequirements: (person: Person) => {
      setSelectedPerson(person);
      setApproveRequirementsDialogOpen(true);
    }
  });

  return (
    <>
      <div className='w-full overflow-x-auto rounded-md border'>
        <Table className='min-w-[640px] text-xs sm:text-sm'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PersonsTableSkeleton columns={columns.length} rows={pageSize} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-muted/50'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedPerson && (
        <PersonEditDialog
          person={selectedPerson}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={(person) => updatePerson(person)}
        />
      )}
      {selectedPerson && (
        <ApproveRequirementsDialog
          person={selectedPerson}
          open={approveRequirementsDialogOpen}
          onOpenChange={setApproveRequirementsDialogOpen}
        />
      )}
    </>
  );
}
