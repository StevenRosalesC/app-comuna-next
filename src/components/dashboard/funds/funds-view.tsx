'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PiggyBank,
  Plus,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fundsService } from '@/services/funds';
import { CreateFundDialog } from './create-fund-dialog';
import { CreateFundMovementDialog } from './create-fund-movement-dialog';
import { Fund } from '@/interfaces/funds';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidModules, ValidActions } from '@/constants/permissions';

export function FundsView() {
  const { permissions } = usePermissionsStore();
  const canCreateFund = permissions?.[ValidModules.FUNDS]?.includes(
    ValidActions.CREATE_FUND
  ) ?? true;
  const canCreateMovement = permissions?.[ValidModules.FUNDS]?.includes(
    ValidActions.CREATE_FUND_MOVEMENT
  ) ?? true;

  const [createFundOpen, setCreateFundOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [selectedFundForMovement, setSelectedFundForMovement] = useState<Fund | null>(null);

  // Fetch all funds
  const {
    data: funds = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['funds-list'],
    queryFn: () => fundsService.getFunds()
  });

  // Calculate totals
  const stats = useMemo(() => {
    const totalBalance = funds.reduce(
      (acc, f) => acc + Number(f.currentBalance || 0),
      0
    );
    const totalMovements = funds.reduce(
      (acc, f) => acc + Number(f.movementsCount || 0),
      0
    );

    return {
      totalBalance,
      fundsCount: funds.length,
      totalMovements
    };
  }, [funds]);

  const handleOpenMovement = (fund: Fund) => {
    setSelectedFundForMovement(fund);
    setMovementDialogOpen(true);
  };

  return (
    <PageContainer scrollable>
      <div className='space-y-6 pb-12'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Fondos Comunitarios'
            description='Administración de fondos permanentes (Fondo Común, Agua Potable, Pro-Obras), balances y Kardex de movimientos.'
          />
          {canCreateFund && (
            <Button
              onClick={() => setCreateFundOpen(true)}
              className='shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white'
            >
              <Plus className='mr-2 h-4 w-4' />
              Crear Nuevo Fondo
            </Button>
          )}
        </div>

        {/* 3 KPI Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {/* Card 1: Saldo Total Comunitario */}
          <Card className='shadow-xs border-emerald-500/30 bg-emerald-500/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Saldo Total Comunitario
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'>
                <DollarSign className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black text-emerald-600 dark:text-emerald-400'>
                ${stats.totalBalance.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Suma de todos los fondos activos
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Fondos Activos */}
          <Card className='shadow-xs border-primary/20 bg-primary/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Fondos Activos
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary'>
                <PiggyBank className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black text-foreground'>
                {stats.fundsCount}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Fondos registrados en la comuna
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Total Movimientos */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Historial de Operaciones
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
                <Clock className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black text-foreground'>
                {stats.totalMovements}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Transacciones de ingreso y egreso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funds Cards Grid */}
        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-52 rounded-2xl' />
            ))}
          </div>
        ) : funds.length === 0 ? (
          <div className='rounded-2xl border bg-card p-12 text-center text-muted-foreground space-y-3'>
            <PiggyBank className='mx-auto h-12 w-12 text-muted-foreground/40' />
            <h3 className='font-semibold text-foreground text-base'>
              No hay fondos comunitarios registrados
            </h3>
            <p className='text-xs max-w-sm mx-auto'>
              Crea el primer fondo (ej: Fondo Común) para empezar a recibir retenciones de colectas solidarias.
            </p>
            {canCreateFund && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCreateFundOpen(true)}
                className='mt-2'
              >
                <Plus className='mr-1.5 h-3.5 w-3.5' />
                Crear Fondo Común
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {funds.map((fund) => {
              const balance = Number(fund.currentBalance || 0);

              return (
                <Card
                  key={fund.fundId}
                  className='flex flex-col justify-between overflow-hidden rounded-2xl border transition-all hover:border-emerald-500/40 hover:shadow-md'
                >
                  <CardHeader className='p-5 pb-3 space-y-2'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                        <PiggyBank className='h-5 w-5' />
                      </div>
                      <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]'>
                        Activo
                      </Badge>
                    </div>

                    <div>
                      <CardTitle className='text-base font-bold text-foreground'>
                        {fund.name}
                      </CardTitle>
                      <CardDescription className='text-xs mt-1 line-clamp-2 text-muted-foreground'>
                        {fund.description || 'Fondo permanente de la comuna.'}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className='p-5 pt-0 space-y-3'>
                    <div className='rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1'>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Saldo Actual
                      </div>
                      <div className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>
                        ${balance.toFixed(2)}
                      </div>
                      <div className='flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/10'>
                        <span>{fund.movementsCount || 0} movimientos</span>
                        <span>Disponible</span>
                      </div>
                    </div>
                  </CardContent>

                  <div className='p-4 pt-0 border-t bg-muted/10 flex items-center gap-2'>
                    <Button
                      asChild
                      className='flex-1 text-xs font-semibold h-9'
                      variant='outline'
                    >
                      <Link href={`/dashboard/funds/${fund.fundId}`}>
                        <span>Ver Kardex</span>
                        <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
                      </Link>
                    </Button>

                    {canCreateMovement && (
                      <Button
                        size='sm'
                        onClick={() => handleOpenMovement(fund)}
                        className='h-9 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs'
                      >
                        <Plus className='h-3.5 w-3.5' />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Fund Dialog */}
        <CreateFundDialog
          open={createFundOpen}
          onOpenChange={setCreateFundOpen}
          onSuccess={() => refetch()}
        />

        {/* Create Movement Dialog */}
        <CreateFundMovementDialog
          open={movementDialogOpen}
          onOpenChange={setMovementDialogOpen}
          fund={selectedFundForMovement}
          onSuccess={() => refetch()}
        />
      </div>
    </PageContainer>
  );
}
