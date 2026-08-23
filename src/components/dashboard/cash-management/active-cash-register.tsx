'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CashRegister } from '@/interfaces/cash-register';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CashRegisterInvoicesTable } from './cash-register-invoices-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreateIncomeForm } from './create-income-form';
import { CreateExpenseForm } from './create-expense-form';
import { CloseCashRegisterDialog } from './close-cash-register-dialog';
import { useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  Lock,
  User,
  Calendar,
  DollarSign,
  Receipt,
  FileText,
  Plus
} from 'lucide-react';

interface ActiveCashRegisterProps {
  activeCashRegister: CashRegister;
  canCloseCashRegister?: boolean;
  canCreateIncome?: boolean;
  canCreateExpense?: boolean;
  canReadIncome?: boolean;
  canReadExpense?: boolean;
  canDeletePayment?: boolean;
  canDeleteIncome?: boolean;
  canDeleteExpense?: boolean;
  canCancelInvoice?: boolean;
}

export default function ActiveCashRegister({
  activeCashRegister,
  canCloseCashRegister = false,
  canCreateIncome = false,
  canCreateExpense = false,
  canCancelInvoice = false
}: ActiveCashRegisterProps) {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
    queryClient.invalidateQueries({ queryKey: ['incomes'] });
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
  };

  const initialAmount = Number(activeCashRegister.initialAmount || 0);
  const currentAmount = Number(activeCashRegister.finalAmount ?? activeCashRegister.initialAmount ?? 0);

  return (
    <div className='space-y-6'>
      {/* Active Cash Register Dashboard Summary Card */}
      <Card className='border shadow-sm overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-emerald-500/5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'>
              <Receipt className='h-6 w-6' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-bold tracking-tight text-foreground'>
                  {activeCashRegister.cashRegisterName || `Caja #${activeCashRegister.cashRegisterId}`}
                </h3>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                  Caja Abierta
                </span>
              </div>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Sesión de cobros activa habilitada para emisión de facturas y transacciones.
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className='flex flex-wrap items-center gap-2'>
            {canCreateIncome && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIncomeDialogOpen(true)}
                className='h-9 text-xs border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              >
                <TrendingUp className='mr-1.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
                Nuevo Ingreso
              </Button>
            )}

            {canCreateExpense && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setExpenseDialogOpen(true)}
                className='h-9 text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-300'
              >
                <TrendingDown className='mr-1.5 h-3.5 w-3.5 text-rose-600 dark:text-rose-400' />
                Nuevo Gasto
              </Button>
            )}

            {canCloseCashRegister && (
              <Button
                variant='destructive'
                size='sm'
                onClick={() => setCloseDialogOpen(true)}
                className='h-9 text-xs'
              >
                <Lock className='mr-1.5 h-3.5 w-3.5' />
                Cerrar Caja
              </Button>
            )}
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <CardContent className='p-6 pt-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Box 1: Responsible */}
            <div className='rounded-xl border bg-card p-3.5 space-y-1 transition-all hover:bg-muted/30'>
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <User className='h-3.5 w-3.5' /> Responsable
              </span>
              <p className='font-semibold text-sm text-foreground truncate'>
                {activeCashRegister.openedByUser?.person.firstName}{' '}
                {activeCashRegister.openedByUser?.person.lastName || 'Cajero'}
              </p>
              <p className='text-[11px] text-muted-foreground'>
                Cajero asignado
              </p>
            </div>

            {/* Box 2: Opening Time */}
            <div className='rounded-xl border bg-card p-3.5 space-y-1 transition-all hover:bg-muted/30'>
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Calendar className='h-3.5 w-3.5' /> Apertura
              </span>
              <p className='font-semibold text-sm text-foreground'>
                {new Date(activeCashRegister.openDate).toLocaleDateString()}
              </p>
              <p className='text-[11px] text-muted-foreground'>
                {new Date(activeCashRegister.openDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Box 3: Initial Amount */}
            <div className='rounded-xl border bg-card p-3.5 space-y-1 transition-all hover:bg-muted/30'>
              <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <DollarSign className='h-3.5 w-3.5' /> Monto Inicial
              </span>
              <p className='font-bold text-lg text-foreground'>
                ${initialAmount.toFixed(2)}
              </p>
              <p className='text-[11px] text-muted-foreground'>Fondo de sencillo</p>
            </div>

            {/* Box 4: Current Balance */}
            <div className='rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1 transition-all'>
              <span className='flex items-center gap-1.5 text-xs font-medium text-primary'>
                <DollarSign className='h-3.5 w-3.5' /> Saldo en Caja
              </span>
              <p className='font-extrabold text-xl text-primary'>
                ${currentAmount.toFixed(2)}
              </p>
              <p className='text-[11px] text-muted-foreground'>Total acumulado</p>
            </div>
          </div>

          {activeCashRegister.notes && (
            <div className='mt-4 flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground'>
              <FileText className='h-4 w-4 shrink-0 mt-0.5' />
              <span>
                <b>Notas de apertura:</b> &quot;{activeCashRegister.notes}&quot;
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices Table for Current Session */}
      <CashRegisterInvoicesTable
        cashRegisterId={activeCashRegister.cashRegisterId}
        canCancelInvoice={canCancelInvoice}
        onDeleteInvoice={handleRefreshData}
      />

      {/* Modal Dialogs */}
      <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
        <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
          <div className='p-6 pb-4 border-b bg-emerald-500/5'>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'>
                <TrendingUp className='h-5 w-5' />
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    Registrar Ingreso
                  </DialogTitle>
                  <Badge variant='outline' className='border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]'>
                    Ingreso
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  Registra un cobro o entrada extraordinaria en la caja activa.
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>
          <div className='p-6 pt-4'>
            <CreateIncomeForm
              onSuccess={() => {
                setIncomeDialogOpen(false);
                handleRefreshData();
              }}
              onCancel={() => setIncomeDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
          <div className='p-6 pb-4 border-b bg-rose-500/5'>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-xs'>
                <TrendingDown className='h-5 w-5' />
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    Registrar Gasto
                  </DialogTitle>
                  <Badge variant='outline' className='border-rose-500/30 text-rose-600 bg-rose-500/10 text-[10px]'>
                    Egreso
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  Registra una salida de efectivo justificada en la caja activa.
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>
          <div className='p-6 pt-4'>
            <CreateExpenseForm
              onSuccess={() => {
                setExpenseDialogOpen(false);
                handleRefreshData();
              }}
              onCancel={() => setExpenseDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Cash Register Dialog */}
      <CloseCashRegisterDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        activeCashRegister={activeCashRegister}
        onSuccess={handleRefreshData}
      />
    </div>
  );
}
