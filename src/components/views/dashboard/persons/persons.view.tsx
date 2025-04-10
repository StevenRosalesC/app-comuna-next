import InsertPersonForm from "@/components/dashboard/persons/insertPersonForm";
import PersonsDataTable from "@/components/dashboard/persons/persons-datatable";
import PersonsActionsSection from "@/components/dashboard/persons/personsActionsSection";

export default function PersonsDashboardView() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <InsertPersonForm />
        </div>
        <PersonsActionsSection />
        <div className="w-full overflow-hidden">
          <PersonsDataTable />
        </div>
      </div>
    </div>
  );
}