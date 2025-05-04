"use client"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { Events } from '../../../interfaces/enums'
import { usePersonsStore } from "@/hooks/store/usePersonsStore"
import { useState, useEffect, useCallback } from "react"
import { PersonsTableToolbar } from "./persons-table-toolbar"
import { PersonsTablePagination } from "./persons-table-pagination"
import { PersonsTable } from "./persons-table"
import { personsService } from "@/services/persons"
import { Person } from "@/interfaces/persons"
import { Switch } from "@/components/ui/switch"

export default function PersonsDataTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { persons, isLoading: personsLoading, fetchPersons, count, updatePerson } = usePersonsStore((state) => ({
    persons: state.persons,
    isLoading: state.isLoading,
    fetchPersons: state.fetchPersons,
    count: state.count,
    updatePerson: state.updatePerson
  }))

  const [loading, setLoading] = useState(false)
  const [showActive, setShowActive] = useState(true)

  const [sorting, setSorting] = useState(() => {
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

  const handleSortingChange = useCallback((newSorting: import("@tanstack/react-table").SortingState) => {
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
        search,
        showActive
      )
    } catch (error) {
      toast.error('Error al obtener las personas')
    }
  }, [pageSize, pageIndex, sorting, search, fetchPersons, showActive])

  const handleEditPerson = async (person: Person) => {
    try {
      const { personId, ...personToUpdate } = person
      const response = await personsService.updatePerson(personId, personToUpdate)
      if (response.status) {
        updatePerson(person)
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Error al actualizar la persona")
    }
  }

  useEffect(() => {
    const handler = setTimeout(fetchData, 300)
    return () => clearTimeout(handler)
  }, [fetchData])

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize))
  }, [count, pageSize])

  useEffect(() => {
    const handlePersonsCreated = (event: CustomEvent) => {
      fetchData();
    }
    document.addEventListener(Events.PERSONS_CREATED, handlePersonsCreated as EventListener);
    return () => {
      document.removeEventListener(Events.PERSONS_CREATED, handlePersonsCreated as EventListener);
    }
  }, [fetchData]);

  useEffect(() => {
    setLoading(personsLoading)
  }, [personsLoading])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Personas</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm">{showActive ? 'Activos' : 'Inactivos'}</span>
          <Switch checked={showActive} onCheckedChange={(checked) => setShowActive(checked)} />
        </div>
      </CardHeader>
      <CardContent>
        <PersonsTableToolbar search={search} onSearchChange={handleSearchChange} />
        <PersonsTable
          data={persons.filter(p => (showActive ? p.status : !p.status))}
          isLoading={loading}
          pageSize={pageSize}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          updatePerson={handleEditPerson}
        />
        <div className="mt-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left mb-2">
            {/* Comentario: Selected rows count logic can be added here if needed */}
            {count} registros en total.
          </div>
          <PersonsTablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            isLoading={loading}
            onPageIndexChange={handlePageIndexChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}
