"use client"
import PersonsDataTable from "@/components/dashboard/persons/persons-datatable";
import { Person } from "@/interfaces/persons";
import { personsService } from "@/services/persons";
import { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export default function PersonsDashboardView() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [personSearch, setPersonSearch] = useState("");

  const handleDataTableChange = ({ sorting, search, pagination }: { sorting: SortingState, search: string, pagination: { pageIndex: number, pageSize: number } }) => {
    setLoading(true);
    setPersonSearch(search);
    const orderBy = sorting.length ? sorting[0].id : "lastName";
    const order = sorting.length && sorting[0].desc ? "desc" : "asc";
    personsService.getPersons(pagination.pageSize, pagination.pageIndex * pagination.pageSize, orderBy, order, personSearch).then((response) => {
      if (response) {
        setPersons(response.data);
        setTotal(response.count);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    handleDataTableChange({ sorting: [], search: "", pagination: { pageIndex: 0, pageSize: 10 } });
  }, []);

  return (
    <div>
      <PersonsDataTable persons={persons} total={total} onDataTableChange={handleDataTableChange} loading={loading} />
    </div>
  );
}