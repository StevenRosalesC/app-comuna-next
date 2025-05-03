"use client"
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PersonsReport } from "../reports/persons";
import { toast } from "sonner";
// For generate list 
export default function PersonsActionsSection() {
  const handleListPersons = async () => {
    try {
      const pdf = await PersonsReport.listAllPersons();
      // Create a blob from the pdf data
      const blob = new Blob([pdf], { type: 'application/pdf' });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Open in new tab
      toast.success('Reporte generado correctamente');
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Error al generar el reporte');
    }
  }
  return (
    <div>
      <div className="flex flex-row items-center gap-2 w-full justify-end ">
        <Button onClick={handleListPersons}>
          <span>Listar</span>
          <Printer className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
