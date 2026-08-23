'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CashRegistersHistoryTable } from '@/components/dashboard/cash-management/cash-registers-history-table';
import { CancelledInvoicesTable } from '@/components/dashboard/cash-management/cancelled-invoices-table';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import Link from 'next/link';
import { ArrowLeft, History, Ban } from 'lucide-react';

export default function CashRegisterHistoryPage() {
  const { permissions } = usePermissionsStore();
  const canCancelInvoice = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.CANCEL_INVOICE
  );

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Navigation & Header */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='sm' asChild className='h-9 px-2.5'>
              <Link href='/dashboard/cash-management'>
                <ArrowLeft className='h-4 w-4 mr-1.5' />
                Volver
              </Link>
            </Button>
            <Heading
              title='Historial de Cajas'
              description='Auditoría histórica de aperturas, arqueos de cierre y facturación emitida.'
            />
          </div>
        </div>
        <Separator />

        {/* History Table Card */}
        <Card className='border shadow-sm'>
          <CardHeader className='pb-4 border-b'>
            <div className='flex items-center gap-2'>
              <History className='h-5 w-5 text-primary' />
              <CardTitle className='text-base font-semibold'>
                Registro de Sesiones de Caja
              </CardTitle>
            </div>
            <CardDescription className='text-xs text-muted-foreground'>
              Filtra por rango de fechas para consultar los cierres de caja anteriores.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6 pt-5'>
            <CashRegistersHistoryTable />
          </CardContent>
        </Card>

        {/* Cancelled Invoices Section if authorized */}
        {canCancelInvoice && (
          <Card className='border shadow-sm'>
            <CardHeader className='pb-4 border-b'>
              <div className='flex items-center gap-2'>
                <Ban className='h-5 w-5 text-destructive' />
                <CardTitle className='text-base font-semibold text-destructive'>
                  Facturas Anuladas
                </CardTitle>
              </div>
              <CardDescription className='text-xs text-muted-foreground'>
                Registro y auditoría de comprobantes cancelados en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className='p-6 pt-5'>
              <CancelledInvoicesTable canViewCancelledInvoices={canCancelInvoice} />
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
