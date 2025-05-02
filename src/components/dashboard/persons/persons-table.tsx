import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table"
import { usePersonsTableColumns } from "./persons-table-columns"
import { PersonsTableSkeleton } from "./persons-table-skeleton"
import { Person } from "@/interfaces/persons"
import { PersonEditDialog } from "./person-edit-dialog"
import { useState } from "react"

interface PersonsTableProps {
  data: Person[]
  isLoading: boolean
  pageSize: number
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
}

export function PersonsTable({ data, isLoading, pageSize, sorting, onSortingChange }: PersonsTableProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const columns = usePersonsTableColumns({
    onEdit: (person) => {
      setSelectedPerson(person)
      setEditDialogOpen(true)
    }
  })

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
    manualSorting: true,
  })

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[640px] text-xs sm:text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null :
                      flexRender(header.column.columnDef.header, header.getContext())}
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
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
        />
      )}
    </>
  )
} 