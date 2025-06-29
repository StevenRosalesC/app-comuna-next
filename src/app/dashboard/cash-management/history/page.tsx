'use client';
import { CashRegistersHistoryTable } from '@/components/dashboard/cash-management/cash-registers-history-table';
import { CancelledInvoicesTable } from '@/components/dashboard/cash-management/cancelled-invoices-table';
import { PageTitle } from '@/components/ui/page-title';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';

export default function CashRegisterHistoryPage() {
  const canViewCancelledInvoices = !usePermission(ValidModules.CASH_MANAGEMENT, [
    ValidActions.CANCEL_INVOICE
  ]);

  return (
    <div className='container mx-auto max-w-[1400px] space-y-4 p-4'>
      <PageTitle title='Historial de Cajas' />
      <CashRegistersHistoryTable />

      {canViewCancelledInvoices && (
        <div className='mt-8'>
          <CancelledInvoicesTable canViewCancelledInvoices={canViewCancelledInvoices} />
        </div>
      )}
    </div>
  );
}
