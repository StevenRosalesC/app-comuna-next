"use client"
import PersonsDataTable from "@/components/dashboard/persons/persons-datatable";
import { Person } from "@/interfaces/persons";
import { personsService } from "@/services/persons";
import { useEffect, useState } from "react";


export default function PersonsDashboardView() {
  const [persons, setPersons] = useState<Person[]>([]);
  useEffect(() => {
    personsService.getPersons().then((response) => {
      if (response) {
        setPersons(response.data)
      }
    })
  }, [])

  return (
    <div>
      <PersonsDataTable persons={persons} />
    </div>
  );
}