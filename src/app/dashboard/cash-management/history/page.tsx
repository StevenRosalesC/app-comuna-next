import { CashRegistersHistoryTable } from '@/components/dashboard/cash-management/cash-registers-history-table';
import { PageTitle } from '@/components/ui/page-title';

export default function CashRegisterHistoryPage() {
  return (
    <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
      <PageTitle title='Historial de Cajas' />
      <CashRegistersHistoryTable />
    </div>
  );
}
