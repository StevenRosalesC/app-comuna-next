import { ArrowUpDown, ArrowUp, ArrowDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Person } from "@/interfaces/persons"
import { ColumnDef } from "@tanstack/react-table"
import { useNeighborhoodsStore } from "@/hooks/store/useNeighborhoodsStore"
import { Skeleton } from "@/components/ui/skeleton"
// import { useState } from "react"

export function usePersonsTableColumns({ onEdit }: { onEdit: (person: Person) => void }) {
  // const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const { neighborhoods, isLoading } = useNeighborhoodsStore(state => state)
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
      size: 32,
    },
    {
      accessorKey: "identification",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center min-w-[110px] w-full justify-start"
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
      ),
      cell: ({ row }) => <div className="min-w-[110px] w-full">{row.getValue("identification")}</div>,
      size: 110,
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center min-w-[120px] w-full justify-start"
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
      ),
      cell: ({ row }) => <div className="min-w-[120px] w-full">{row.getValue("lastName")}</div>,
      size: 120,
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center min-w-[120px] w-full justify-start"
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
      ),
      cell: ({ row }) => <p className="text-left min-w-[120px] w-full">{row.getValue("firstName")}</p>,
      size: 120,
    },
    {
      accessorKey: "birthDate",
      enableSorting: true,
      header: () => <Button variant="ghost" className="flex items-center min-w-[90px] w-full justify-start">Fecha de nacimiento</Button>,
      cell: ({ row }) => {
        const date = row.getValue("birthDate")
        if (!date) return <div className="min-w-[90px] w-full">-</div>
        try {
          return <div className="text-right min-w-[90px] w-full">{new Date(date as string).toLocaleDateString('es-ES')}</div>
        } catch (error) {
          return <div className="min-w-[90px] w-full">Fecha inválida</div>
        }
      },
      size: 90,
    },
    {
      accessorKey: "neighborhoodId",
      enableSorting: false,
      header: () => <Button variant="ghost" className="flex items-center min-w-[100px] w-full justify-start">Barrio</Button>,
      cell: ({ row }) => {
        const neighborhoodId = row.getValue("neighborhoodId") as string
        const neighborhood = neighborhoods?.find((n) => n.neighborhoodId === neighborhoodId)
        return (
          <div className="min-w-[100px] w-full">
            {isLoading ? <Skeleton className="h-4 w-full" /> :
              <div className="min-w-[100px] w-full">{neighborhood?.neighborhoodName ?? "-"}</div>
            }
          </div>
        )
      },
      size: 100,
    },
    {
      accessorKey: "email",
      enableSorting: false,
      header: () => <Button variant="ghost" className="flex items-center min-w-[140px] w-full justify-start">Email</Button>,
      cell: ({ row }) => <div className="min-w-[140px] w-full">{row.getValue("email")}</div>,
      size: 140,
    },
    {
      accessorKey: "status",
      enableSorting: true,
      header: () => <Button variant="ghost" className="flex items-center min-w-[70px] w-full justify-start">Estado</Button>,
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean
        return (
          <Badge variant={status ? "default" : "destructive"} className="min-w-[70px] w-full">
            {status ? "Activo" : "Inactivo"}
          </Badge>
        )
      },
      size: 70,
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right min-w-[60px] w-full">Acciones</div>,
      cell: ({ row }) => {
        const person = row.original
        return (
          <div className="flex justify-end gap-2 min-w-[60px] w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(person)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )
      },
      size: 60,
    }
  ]
  return columns
} 