'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText
} from 'lucide-react';
import { ActiveCashRegisterWrapper } from './active-cash-register-wrapper';
import { CashRegistersHistoryTable } from './cash-registers-history-table';
import { CreateIncomeForm } from './create-income-form';
import { CreateExpenseForm } from './create-expense-form';
import { ExpensesTable } from './expenses-table';
import { IncomesTable } from './incomes-table';
import { GenerateReportDialog } from './generate-report-dialog';

export function CashManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Caja</h1>
        <GenerateReportDialog />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="incomes" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ingresos
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Gastos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Estado de Caja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveCashRegisterWrapper key={refreshKey} onRefresh={handleRefresh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomes" className="space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Gestión de Ingresos</h2>
              <p className="text-sm text-muted-foreground">
                Los ingresos se registran en la caja activa actual
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Ingreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Ingreso</DialogTitle>
                </DialogHeader>
                <CreateIncomeForm onSuccess={handleRefresh} />
              </DialogContent>
            </Dialog>
          </div>

          <IncomesTable onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Gestión de Gastos</h2>
              <p className="text-sm text-muted-foreground">
                Los gastos se registran en la caja activa actual
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Gasto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                </DialogHeader>
                <CreateExpenseForm onSuccess={handleRefresh} />
              </DialogContent>
            </Dialog>
          </div>

          <ExpensesTable onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Historial de Cajas</h2>
          </div>

          <CashRegistersHistoryTable key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 