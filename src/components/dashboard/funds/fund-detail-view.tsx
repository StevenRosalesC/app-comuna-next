'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PiggyBank,
  ArrowLeft,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Search,
  RefreshCw,
  Calendar,
  User,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fundsService } from '@/services/funds';
import { CreateFundMovementDialog } from './create-fund-movement-dialog';
import { FundMovement } from '@/interfaces/funds';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidModules, ValidActions } from '@/constants/permissions';

interface FundDetailViewProps {
  fundId?: string;
}

export function FundDetailView({ fundId: propFundId }: FundDetailViewProps) {
  console.log({propFundId})
  const params = useParams<{ id: string }>();
  const fundId = (params?.id as string) || propFundId || '';
  const { permissions } = usePermissionsStore();
  const canCreateMovement = permissions?.[ValidModules.FUNDS]?.includes(
    ValidActions.CREATE_FUND_MOVEMENT
  ) ?? true;

  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Fetch fund details
  const {
    data: fund,
    isLoading: loadingFund,
    refetch: refetchFund
  } = useQuery({
    queryKey: ['fund', fundId],
    queryFn: () => fundsService.getFundById(fundId),
    enabled: Boolean(fundId)
  });

  // Fetch movements
  const {
    data: movementsData,
    isLoading: loadingMovements,
    refetch: refetchMovements,
    isFetching: isFetchingMovements
  } = useQuery({
    queryKey: ['fund-movements', fundId, typeFilter],
    queryFn: () =>
      fundsService.getFundMovements(fundId, {
        limit: 200,
        offset: 0,
        type: typeFilter !== 'ALL' ? typeFilter : undefined
      }),
    enabled: Boolean(fundId)
  });

  const movements = movementsData?.data || [];

  const handleRefresh = () => {
    refetchFund();
    refetchMovements();
  };

  // Filter movements by search
  const filteredMovements = useMemo(() => {
    if (!searchTerm.trim()) return movements;
    const query = searchTerm.toLowerCase();
    return movements.filter(
      (m) =>
        m.concept?.toLowerCase().includes(query) ||
        m.sourceType?.toLowerCase().includes(query)
    );
  }, [movements, searchTerm]);

  // Kardex summary totals
  const stats = useMemo(() => {
    let totalIncomes = 0;
    let totalExpenses = 0;

    movements.forEach((m) => {
      const amt = Number(m.amount || 0);
      if (m.type === 'INCOME') totalIncomes += amt;
      if (m.type === 'EXPENSE') totalExpenses += amt;
    });

    return {
      totalIncomes,
      totalExpenses,
      count: movements.length
    };
  }, [movements]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getSourceTypeLabel = (sourceType?: string) => {
    switch (sourceType) {
      case 'COLLECTION_RETENTION':
        return (
          <Badge variant='outline' className='bg-primary/5 text-primary border-primary/20 text-[10px]'>
            Retención de Colecta
          </Badge>
        );
      case 'MANUAL_DEPOSIT':
        return (
          <Badge variant='outline' className='text-[10px]'>
            Depósito Manual
          </Badge>
        );
      case 'MANUAL_WITHDRAWAL':
        return (
          <Badge variant='outline' className='text-[10px] text-rose-600 border-rose-500/20'>
            Retiro / Gasto
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='text-[10px]'>
            {sourceType || 'General'}
          </Badge>
        );
    }
  };

  const currentBalance = Number(fund?.currentBalance || 0);

  return (
    <PageContainer scrollable>
      <div className='space-y-6 pb-12'>
        {/* Top Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='icon' asChild className='h-9 w-9'>
              <Link href='/dashboard/funds'>
                <ArrowLeft className='h-4 w-4' />
              </Link>
            </Button>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                  {fund?.name || 'Kardex del Fondo'}
                </h1>
                <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'>
                  Fondo Activo
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {fund?.description || 'Control de ingresos, egresos y retenciones comunitarias.'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRefresh}
              disabled={isFetchingMovements}
              className='h-9'
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetchingMovements ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>

            {canCreateMovement && (
              <Button
                size='sm'
                onClick={() => setMovementDialogOpen(true)}
                className='h-9 bg-emerald-600 hover:bg-emerald-700 text-white'
              >
                <Plus className='mr-1.5 h-4 w-4' />
                Registrar Movimiento
              </Button>
            )}
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Saldo Disponible Actual */}
          <Card className='border-emerald-500/30 bg-emerald-500/5 shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Saldo Actual Disponible
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'>
                <DollarSign className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black text-emerald-600 dark:text-emerald-400'>
                ${currentBalance.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Balance contable disponible
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Ingresos */}
          <Card className='shadow-xs border-emerald-500/20'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Total Ingresos
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600'>
                <ArrowDownLeft className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                +${stats.totalIncomes.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Retenciones y depósitos
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Total Egresos */}
          <Card className='shadow-xs border-rose-500/20'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Total Egresos
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600'>
                <ArrowUpRight className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-rose-600 dark:text-rose-400'>
                -${stats.totalExpenses.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Gastos e inversiones
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Total Movimientos */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Total Movimientos
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Clock className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-foreground'>
                {movements.length}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Transacciones registradas en Kardex
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar & Search */}
        <div className='rounded-2xl border bg-card p-4 space-y-3 shadow-xs'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
            <Tabs
              value={typeFilter}
              onValueChange={setTypeFilter}
              className='w-full sm:w-auto'
            >
              <TabsList className='grid grid-cols-3 w-full sm:w-auto'>
                <TabsTrigger value='ALL' className='text-xs'>
                  Todos ({movements.length})
                </TabsTrigger>
                <TabsTrigger
                  value='INCOME'
                  className='text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-700'
                >
                  Ingresos
                </TabsTrigger>
                <TabsTrigger
                  value='EXPENSE'
                  className='text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-700'
                >
                  Egresos
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className='relative w-full sm:max-w-xs'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
              <Input
                placeholder='Buscar por concepto...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8 h-9 text-xs'
              />
            </div>
          </div>
        </div>

        {/* Kardex Movements Table */}
        <div className='rounded-2xl border bg-card overflow-hidden shadow-xs'>
          <div className='p-4 border-b bg-muted/10 flex items-center justify-between'>
            <span className='font-semibold text-sm'>
              Kardex de Movimientos Históricos
            </span>
            <Badge variant='outline' className='text-xs'>
              {filteredMovements.length} movimientos
            </Badge>
          </div>

          {loadingMovements ? (
            <div className='p-6 space-y-3'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className='h-12 w-full rounded-xl' />
              ))}
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className='p-12 text-center text-muted-foreground space-y-2'>
              <PiggyBank className='mx-auto h-10 w-10 text-muted-foreground/40' />
              <p className='font-medium text-sm text-foreground'>
                No hay movimientos registrados
              </p>
              <p className='text-xs'>
                Los aportes de colectas o movimientos manuales aparecerán reflejados aquí.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[160px]'>Fecha y Hora</TableHead>
                    <TableHead className='w-[120px]'>Tipo</TableHead>
                    <TableHead>Concepto / Detalle</TableHead>
                    <TableHead>Origen / Fuente</TableHead>
                    <TableHead className='text-right'>Monto ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((m) => {
                    const isIncome = m.type === 'INCOME';

                    return (
                      <TableRow key={m.movementId} className='hover:bg-muted/40'>
                        {/* Date */}
                        <TableCell className='text-xs text-muted-foreground font-medium'>
                          {formatDate(m.createdAt)}
                        </TableCell>

                        {/* Type Badge */}
                        <TableCell>
                          {isIncome ? (
                            <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs'>
                              <ArrowDownLeft className='h-3 w-3 mr-1' />
                              Ingreso
                            </Badge>
                          ) : (
                            <Badge className='bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-xs'>
                              <ArrowUpRight className='h-3 w-3 mr-1' />
                              Egreso
                            </Badge>
                          )}
                        </TableCell>

                        {/* Concept */}
                        <TableCell>
                          <div className='font-medium text-sm text-foreground'>
                            {m.concept}
                          </div>
                        </TableCell>

                        {/* Source Type */}
                        <TableCell>
                          {getSourceTypeLabel(m.sourceType)}
                        </TableCell>

                        {/* Amount */}
                        <TableCell className='text-right'>
                          <span
                            className={`font-bold text-sm ${
                              isIncome
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? '+' : '-'}${Number(m.amount).toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Create Movement Dialog */}
        <CreateFundMovementDialog
          open={movementDialogOpen}
          onOpenChange={setMovementDialogOpen}
          fund={fund || null}
          fundId={fundId}
          onSuccess={handleRefresh}
        />
      </div>
    </PageContainer>
  );
}
