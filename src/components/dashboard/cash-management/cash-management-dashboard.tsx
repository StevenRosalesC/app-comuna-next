'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  History,
  Lock,
  Sparkles,
  Wallet
} from 'lucide-react';
import { ActiveCashRegisterWrapper } from './active-cash-register-wrapper';
import { CashRegistersHistoryTable } from './cash-registers-history-table';
import { CreateIncomeForm } from './create-income-form';
import { CreateExpenseForm } from './create-expense-form';
import { ExpensesTable } from './expenses-table';
import { IncomesTable } from './incomes-table';
import { GenerateReportDialog } from './generate-report-dialog';
import { useQuery } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cash-register';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function CashManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Quick stats queries for active cash register
  const { data: activeRegister, isLoading: loadingRegister } = useQuery({
    queryKey: ['activeCashRegister', refreshKey],
    queryFn: cashRegisterService.getActiveRegister
  });

  const { data: incomesData, isLoading: loadingIncomes } = useQuery({
    queryKey: ['incomes-stats', refreshKey, activeRegister?.cashRegisterId],
    queryFn: () =>
      cashRegisterService.getIncomes({
        limit: 100,
        offset: 0,
        cashRegisterId: activeRegister ? Number(activeRegister.cashRegisterId) : undefined
      }),
    enabled: !!activeRegister?.cashRegisterId
  });

  const { data: expensesData, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses-stats', refreshKey],
    queryFn: () => cashRegisterService.getExpenses({ limit: 100, offset: 0 })
  });

  const initialAmount = Number(activeRegister?.initialAmount || 0);
  const finalAmount = Number(activeRegister?.finalAmount ?? activeRegister?.initialAmount ?? 0);
  const totalIncomesAmount = (incomesData?.incomes || []).reduce(
    (acc: number, curr: any) => acc + (curr.status !== false ? Number(curr.amount) : 0),
    0
  );
  const totalExpensesAmount = (expensesData?.expenses || []).reduce(
    (acc: number, curr: any) => acc + (curr.status !== false ? Number(curr.amount) : 0),
    0
  );

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Gestión de Caja'
            description='Control de apertura y cierre de caja, registro de cobros, ingresos extraordinarios, gastos y arqueo financiero.'
          />
          <div className='flex items-center gap-2'>
            <GenerateReportDialog />
          </div>
        </div>
        <Separator />

        {/* 4 Financial KPI Metric Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Register Status */}
          <Card
            className='cursor-pointer transition-all hover:shadow-md hover:border-primary/40'
            onClick={() => setActiveTab('overview')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Estado de Caja</CardTitle>
              <Wallet className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {loadingRegister ? (
                <Skeleton className='h-7 w-20' />
              ) : activeRegister ? (
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' />
                  <div className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                    Abierta
                  </div>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600' />
                  <div className='text-lg font-bold text-muted-foreground'>
                    Cerrada
                  </div>
                </div>
              )}
              <CardDescription className='text-xs'>
                {activeRegister
                  ? `Iniciada con $${initialAmount.toFixed(2)}`
                  : 'Requiere apertura para cobros'}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2: Current Register Balance */}
          <Card
            className='cursor-pointer transition-all hover:shadow-md hover:border-primary/40'
            onClick={() => setActiveTab('overview')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Saldo en Caja</CardTitle>
              <DollarSign className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              {loadingRegister ? (
                <Skeleton className='h-7 w-24' />
              ) : (
                <div className='text-2xl font-bold text-primary'>
                  ${finalAmount.toFixed(2)}
                </div>
              )}
              <CardDescription className='text-xs'>
                Efectivo acumulado en sesión
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3: Total Incomes */}
          <Card
            className='cursor-pointer transition-all hover:shadow-md hover:border-primary/40'
            onClick={() => setActiveTab('incomes')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Ingresos Sesión</CardTitle>
              <TrendingUp className='h-4 w-4 text-emerald-500' />
            </CardHeader>
            <CardContent>
              {loadingIncomes ? (
                <Skeleton className='h-7 w-20' />
              ) : (
                <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                  +${totalIncomesAmount.toFixed(2)}
                </div>
              )}
              <CardDescription className='text-xs'>
                {incomesData?.total ?? 0} registros de ingreso
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 4: Total Expenses */}
          <Card
            className='cursor-pointer transition-all hover:shadow-md hover:border-primary/40'
            onClick={() => setActiveTab('expenses')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Gastos Registrados</CardTitle>
              <TrendingDown className='h-4 w-4 text-rose-500' />
            </CardHeader>
            <CardContent>
              {loadingExpenses ? (
                <Skeleton className='h-7 w-20' />
              ) : (
                <div className='text-2xl font-bold text-rose-600 dark:text-rose-400'>
                  -${totalExpensesAmount.toFixed(2)}
                </div>
              )}
              <CardDescription className='text-xs'>
                {expensesData?.total ?? 0} egresos contabilizados
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full space-y-4'>
          <div className='border-b pb-1'>
            <TabsList className='inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground'>
              <TabsTrigger value='overview' className='flex items-center gap-1.5 text-xs px-3'>
                <Receipt className='h-3.5 w-3.5' />
                <span>Caja Activa</span>
              </TabsTrigger>
              <TabsTrigger value='incomes' className='flex items-center gap-1.5 text-xs px-3'>
                <TrendingUp className='h-3.5 w-3.5' />
                <span>Ingresos</span>
              </TabsTrigger>
              <TabsTrigger value='expenses' className='flex items-center gap-1.5 text-xs px-3'>
                <TrendingDown className='h-3.5 w-3.5' />
                <span>Gastos</span>
              </TabsTrigger>
              <TabsTrigger value='history' className='flex items-center gap-1.5 text-xs px-3'>
                <History className='h-3.5 w-3.5' />
                <span>Historial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview (Active Register) */}
          <TabsContent value='overview' className='space-y-4 mt-4'>
            <ActiveCashRegisterWrapper key={refreshKey} onRefresh={handleRefresh} />
          </TabsContent>

          {/* Tab 2: Incomes */}
          <TabsContent value='incomes' className='space-y-4 mt-4'>
            <Card className='border shadow-sm'>
              <CardHeader className='pb-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0'>
                <div>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-base font-semibold'>
                      Registro de Ingresos
                    </CardTitle>
                    <Badge variant='secondary' className='text-xs'>
                      {incomesData?.total ?? 0}
                    </Badge>
                  </div>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Cobros extraordinarios y aportaciones registradas en la caja activa.
                  </CardDescription>
                </div>
                <Button
                  size='sm'
                  onClick={() => setIncomeDialogOpen(true)}
                  className='bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs'
                >
                  <Plus className='mr-1.5 h-3.5 w-3.5' />
                  Nuevo Ingreso
                </Button>
              </CardHeader>
              <CardContent className='p-6 pt-5'>
                <IncomesTable onRefresh={handleRefresh} />
              </CardContent>
            </Card>

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
                      handleRefresh();
                    }}
                    onCancel={() => setIncomeDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab 3: Expenses */}
          <TabsContent value='expenses' className='space-y-4 mt-4'>
            <Card className='border shadow-sm'>
              <CardHeader className='pb-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0'>
                <div>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-base font-semibold'>
                      Registro de Gastos
                    </CardTitle>
                    <Badge variant='secondary' className='text-xs'>
                      {expensesData?.total ?? 0}
                    </Badge>
                  </div>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Egresos y pagos justificados realizados con cargo a la caja activa.
                  </CardDescription>
                </div>
                <Button
                  size='sm'
                  onClick={() => setExpenseDialogOpen(true)}
                  className='bg-rose-600 hover:bg-rose-700 text-white h-9 text-xs'
                >
                  <Plus className='mr-1.5 h-3.5 w-3.5' />
                  Nuevo Gasto
                </Button>
              </CardHeader>
              <CardContent className='p-6 pt-5'>
                <ExpensesTable onRefresh={handleRefresh} />
              </CardContent>
            </Card>

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
                      handleRefresh();
                    }}
                    onCancel={() => setExpenseDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab 4: History */}
          <TabsContent value='history' className='space-y-4 mt-4'>
            <Card className='border shadow-sm'>
              <CardHeader className='pb-4 border-b'>
                <CardTitle className='text-base font-semibold'>
                  Historial y Arqueos de Caja
                </CardTitle>
                <CardDescription className='text-xs text-muted-foreground'>
                  Consulta de aperturas, cierres anteriores y auditoría de recaudación por fecha.
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6 pt-5'>
                <CashRegistersHistoryTable key={refreshKey} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}