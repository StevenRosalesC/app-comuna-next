'use client';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';
// For generate list
export default function UsersActionsSelection() {
  const handleListPersons = async () => {
    try {
      // const pdf = await PersonsReport.listAllPersons();
      // // Create a blob from the pdf data
      // const blob = new Blob([pdf], { type: 'application/pdf' });
      // // Create a URL for the blob
      // const url = window.URL.createObjectURL(blob);
      // // Open in new tab
      toast.success('Reporte generado correctamente');
      // window.open(url, '_blank');
    } catch (error) {
      toast.error('Error al generar el reporte');
    }
  };
  return (
    <div>
      <div className='flex w-full flex-row items-center justify-end gap-2 '>
        <Button onClick={handleListPersons}>
          <span>Listar</span>
          <Printer className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
