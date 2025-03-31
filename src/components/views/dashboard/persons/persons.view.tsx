"use client"
import InsertPersonForm from "@/components/dashboard/persons/insertPersonForm";
import PersonsDataTable from "@/components/dashboard/persons/persons-datatable";

export default function PersonsDashboardView() {
  return (
    <div className="flex flex-col ">
      <InsertPersonForm />
      <PersonsDataTable />
    </div>
  );
}