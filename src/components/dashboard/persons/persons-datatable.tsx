"use client"
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
  ColumnSort,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect, useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonEditDialog } from "./person-edit-dialog"
import { toast } from 'sonner'
import { Events } from '../../../interfaces/enums'
import { useNeighborhoodsList } from "@/hooks/store/useNeighborhoodsStore"
import { usePersonsStore } from "@/hooks/store/usePersonsStore"

export default function PersonsDataTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { neighborhoods, isLoading } = useNeighborhoodsList()
  const { persons, isLoading: personsLoading, fetchPersons, count } = usePersonsStore((state) => ({
    persons: state.persons,
    isLoading: state.isLoading,
    fetchPersons: state.fetchPersons,
    count: state.count
  }))

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortField = searchParams.get("sort")
    const sortDir = searchParams.get("dir")
    return sortField && sortDir ? [{ id: sortField, desc: sortDir === "desc" }] : []
  })
  const [pageSize, setPageSize] = useState(() =>
    Number(searchParams.get("size")) || 10
  )
  const [pageIndex, setPageIndex] = useState(() =>
    Number(searchParams.get("page")) || 0
  )
  const [search, setSearch] = useState(() =>
    searchParams.get("search") || ""
  )
  const [pageCount, setPageCount] = useState(() => Math.ceil(count / pageSize))
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const columns: ColumnDef<Person>[] = [
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
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
            )}
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
            Apellidos
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
            )}
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
            Nombres
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <p className="text-left">
          {row.getValue("firstName")}
        </p>
      )
    },
    {
      accessorKey: "birthDate",
      enableSorting: true,
      header: () => {
        return <Button variant="ghost" className="flex items-center">Fecha de nacimiento</Button>
      },
      cell: ({ row }) => {
        const date = row.getValue("birthDate")
        if (!date) return <div>-</div>

        try {
          return <div className="text-right">{new Date(date as string).toLocaleDateString('es-ES')}</div>
        } catch (error) {
          return <div>Fecha inválida</div>
        }
      }
    },
    {
      accessorKey: "neighborhoodId",
      enableSorting: false,
      header: () => {
        return <Button variant="ghost" className="flex items-center">Barrio</Button>
      },
      cell: ({ row }) => {
        const neighborhoodId = row.getValue("neighborhoodId") as string
        const neighborhood = neighborhoods.find((neighborhood: import('@/store/neighborhoodsStore').Neighborhood) => neighborhood.neighborhoodId === neighborhoodId)
        return <div>{neighborhood?.neighborhoodName ?? "-"}</div>
      }
    },
    {
      accessorKey: "email",
      enableSorting: false,
      header: () => {
        return (
          <Button variant="ghost" className="flex items-center">
            Email
          </Button>
        )
      }
    },
    {
      accessorKey: "status",
      enableSorting: true,
      header: () => {
        return <Button variant="ghost" className="flex items-center">Estado</Button>
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean
        return (
          <Badge variant={status ? "default" : "destructive"}>
            {status ? "Activo" : "Inactivo"}
          </Badge>
        )
      }
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const person = row.original

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedPerson(person)
                setEditDialogOpen(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

          </div>
        )
      }
    }
  ]

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false
    })
  }, [pathname, router, searchParams])

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
    if (newSorting.length > 0) {
      updateUrl({
        sort: newSorting[0].id,
        dir: newSorting[0].desc ? "desc" : "asc"
      })
    } else {
      updateUrl({ sort: null, dir: null })
    }
  }, [updateUrl])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPageIndex(0)
    updateUrl({
      size: newSize.toString(),
      page: "0"
    })
  }, [updateUrl])

  const handlePageIndexChange = useCallback((newIndex: number) => {
    setPageIndex(newIndex)
    updateUrl({ page: newIndex.toString() })
  }, [updateUrl])

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setPageIndex(0)
    updateUrl({
      search: newSearch || null,
      page: "0"
    })
  }, [updateUrl])

  const fetchData = useCallback(async () => {
    try {
      const orderBy = sorting.length ? sorting[0].id : "lastName"
      const order = sorting.length && sorting[0].desc ? "desc" : "asc"

      await fetchPersons(
        pageSize,
        pageIndex,
        orderBy,
        order,
        search
      )
    } catch (error) {
      toast.error('Error al obtener las personas')
    }
  }, [pageSize, pageIndex, sorting, search, fetchPersons])

  useEffect(() => {
    const handler = setTimeout(fetchData, 300)
    return () => clearTimeout(handler)
  }, [fetchData])

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize))
  }, [count, pageSize])

  const table = useReactTable({
    data: persons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        handleSortingChange(newSorting);
      } else {
        handleSortingChange(updater);
      }
    },
    state: {
      sorting: sorting as ColumnSort[],
      pagination: { pageIndex, pageSize },
    },
    pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize })
        handlePageIndexChange(newState.pageIndex)
        handlePageSizeChange(newState.pageSize)
      }
    },
    manualPagination: true,
    manualSorting: true,
  })

  useEffect(() => {
    const handlePersonsCreated = (event: CustomEvent) => {
      fetchData();
    }
    document.addEventListener(Events.PERSONS_CREATED, handlePersonsCreated as EventListener);

    return () => {
      document.removeEventListener(Events.PERSONS_CREATED, handlePersonsCreated as EventListener);
    }
  }, [fetchData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Personas</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar persona"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[640px]">
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
                Array.from({ length: persons.length || pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: columns.length }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-9 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
        </div>

        <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {count} registros seleccionados.
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 lg:space-x-8">
            <div className="flex items-center justify-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">Registros por página</p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
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

            <div className="flex items-center justify-center gap-2">
              <div className="hidden sm:flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageIndexChange(0)}
                  disabled={pageIndex === 0 || isLoading}
                  className="px-2"
                >
                  {"<<"}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageIndexChange(pageIndex - 1)}
                disabled={pageIndex === 0 || isLoading}
              >
                Anterior
              </Button>
              <div className="flex items-center justify-center text-sm min-w-[100px]">
                <span className="hidden sm:inline">Página </span>
                {pageIndex + 1} de {pageCount}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageIndexChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1 || isLoading}
              >
                Siguiente
              </Button>
              <div className="hidden sm:flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageIndexChange(pageCount - 1)}
                  disabled={pageIndex >= pageCount - 1 || isLoading}
                  className="px-2"
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {selectedPerson && (
        <PersonEditDialog
          person={selectedPerson}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </Card>
  )
}
