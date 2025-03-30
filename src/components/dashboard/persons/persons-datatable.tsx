"use client"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Person } from "@/interfaces/persons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const columns: ColumnDef<Person>[] = [
  {
    id: "selection",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todas las filas"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, {
    accessorKey: "identification",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Cédula
          <ArrowUpDown
            size="1.25em"
            className="ml-1"
          />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("identification")}
      </div>
    )
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Apellido
          <ArrowUpDown
            size="1.25em"
            className="ml-1"
          />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("lastName")}
      </div>
    )
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Nombre
          <ArrowUpDown
            size="1.25em"
            className="ml-1"
          />
        </Button>
      )
    },
    cell: ({ row }) => (
      <p className="text-left">
        {row.getValue("firstName")}
      </p>
    )
  },
]

interface Props {
  persons: Person[],
  total: number,
  onDataTableChange: (params: { sorting: SortingState, search: string, selected: Person[], pagination: { pageIndex: number, pageSize: number } }) => void,
  loading: boolean
}

export default function PersonsDataTable({ persons, total, onDataTableChange, loading }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  useEffect(() => {
    setPageIndex(0)
    onDataTableChange({
      sorting,
      search: debouncedSearch,
      selected: table?.getSelectedRowModel().rows.map(row => row.original) ?? [],
      pagination: { pageIndex: 0, pageSize }
    })
  }, [debouncedSearch])

  const table = useReactTable({
    data: persons,
    columns,
    getCoreRowModel: getCoreRowModel<Person>(),
    onSortingChange: (updaterOrValue) => {
      const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
      setSorting(newSorting)
      onDataTableChange({ sorting: newSorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex, pageSize } })
    },
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        })
        setPageIndex(newState.pageIndex)
        setPageSize(newState.pageSize)
        onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: newState.pageIndex, pageSize: newState.pageSize } })
      } else {
        setPageIndex(updater.pageIndex)
        setPageSize(updater.pageSize)
        onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: updater.pageIndex, pageSize: updater.pageSize } })
      }
    },
    manualPagination: true,
    manualSorting: true,
  })

  useEffect(() => {
    setPageCount(Math.ceil(total / pageSize))
  }, [total, pageSize])

  return (
    <>
      <Input
        placeholder="Buscar persona"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
        }}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              }
              )}

            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
                className="h-24 text-center"
              >
                No hay resultados
              </TableCell>
            </TableRow>
          )}

        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {total} registros seleccionados.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Registros por página</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex, pageSize: Number(value) } })
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {pageIndex + 1} de {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex(0)
                onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: 0, pageSize } })
              }}
              disabled={pageIndex === 0}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex(prev => {
                  const newIndex = prev - 1
                  onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: newIndex, pageSize } })
                  return newIndex
                })
              }}
              disabled={pageIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex(prev => {
                  const newIndex = prev + 1
                  onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: newIndex, pageSize } })
                  return newIndex
                })
              }}
              disabled={pageIndex >= pageCount - 1}
            >
              Siguiente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex(pageCount - 1)
                onDataTableChange({ sorting, search: debouncedSearch, selected: table.getSelectedRowModel().rows.map(row => row.original), pagination: { pageIndex: pageCount - 1, pageSize } })
              }}
              disabled={pageIndex >= pageCount - 1}
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
