'use client';

import { useParams } from 'next/navigation';
import { cashRegisterService } from '@/services/cash-register';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CashRegisterInvoicesTable } from '@/components/dashboard/cash-management/cash-register-invoices-table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Receipt,
  User,
  FileText,
  Clock,
  AlertCircle,
  RotateCw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CashRegisterDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string) || '';

  const {
    data: cashRegister,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['cashRegister', id],
    queryFn: () => cashRegisterService.getCashRegisterById(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <PageContainer scrollable>
        <div className='space-y-6'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-9 w-24' />
            <Skeleton className='h-8 w-64' />
          </div>
          <Separator />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-28 w-full rounded-xl' />
            ))}
          </div>
          <Skeleton className='h-80 w-full rounded-xl' />
        </div>
      </PageContainer>
    );
  }

  if (isError || !cashRegister) {
    return (
      <PageContainer scrollable>
        <div className='flex flex-col items-center justify-center min-h-[400px] text-center space-y-4'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive'>
            <AlertCircle className='h-7 w-7' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-bold text-foreground'>
              No se pudo cargar la información de la caja
            </h3>
            <p className='text-xs text-muted-foreground max-w-sm'>
              La caja solicitada no existe o no tienes los permisos para consultar sus transacciones.
            </p>
          </div>
          <div className='flex items-center gap-2 pt-2'>
            <Button variant='outline' size='sm' onClick={() => refetch()}>
              <RotateCw className='mr-2 h-3.5 w-3.5' /> Reintentar
            </Button>
            <Button size='sm' asChild>
              <Link href='/dashboard/cash-management'>
                <ArrowLeft className='mr-2 h-3.5 w-3.5' /> Volver a Caja
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const isOpen = !cashRegister.closed;
  const initialAmount = Number(cashRegister.initialAmount || 0);
  const finalAmount = cashRegister.finalAmount != null ? Number(cashRegister.finalAmount) : null;

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
            <div className='flex items-center gap-2.5'>
              <Heading
                title={cashRegister.cashRegisterName || `Caja #${cashRegister.cashRegisterId}`}
                description='Detalles de arqueo, usuarios responsables y facturas emitidas.'
              />
              {isOpen ? (
                <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                  Abierta
                </span>
              ) : (
                <Badge variant='secondary' className='text-xs'>
                  Cerrada
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Separator />

        {/* 4 Financial & Session Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Identifier */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Identificador</CardTitle>
              <Receipt className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold font-mono'>#{cashRegister.cashRegisterId}</div>
              <CardDescription className='text-xs truncate'>
                {cashRegister.cashRegisterName || 'Sin nombre específico'}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2: Opening */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Apertura</CardTitle>
              <Calendar className='h-4 w-4 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <div className='text-sm font-semibold truncate'>
                {cashRegister.openedByUser
                  ? `${cashRegister.openedByUser.person.firstName} ${cashRegister.openedByUser.person.lastName}`
                  : 'N/A'}
              </div>
              <CardDescription className='text-xs flex items-center gap-1 mt-0.5'>
                <Clock className='h-3 w-3' />
                {format(new Date(cashRegister.openDate), 'dd/MM/yyyy HH:mm', { locale: es })}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3: Closing */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Cierre</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-sm font-semibold truncate'>
                {cashRegister.closedByUser
                  ? `${cashRegister.closedByUser.person.firstName} ${cashRegister.closedByUser.person.lastName}`
                  : isOpen ? 'En curso' : 'N/A'}
              </div>
              <CardDescription className='text-xs flex items-center gap-1 mt-0.5'>
                {cashRegister.closeDate ? (
                  <>
                    <Clock className='h-3 w-3' />
                    {format(new Date(cashRegister.closeDate), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </>
                ) : (
                  'Sesión no finalizada'
                )}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 4: Amounts (Initial vs Final) */}
          <Card className='shadow-xs border-primary/20 bg-primary/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-primary'>Arqueo de Efectivo</CardTitle>
              <DollarSign className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='flex items-baseline justify-between'>
                <div>
                  <span className='text-[10px] uppercase text-muted-foreground font-semibold'>Inicial: </span>
                  <span className='font-semibold text-xs text-foreground'>${initialAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className='text-[10px] uppercase text-primary font-semibold'>Final: </span>
                  <span className='font-bold text-base text-primary'>
                    {finalAmount != null ? `$${finalAmount.toFixed(2)}` : 'En curso'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Banner if available */}
        {cashRegister.notes && (
          <div className='flex items-start gap-2.5 rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground'>
            <FileText className='h-4 w-4 shrink-0 mt-0.5 text-foreground' />
            <div>
              <span className='font-semibold text-foreground'>Notas de Apertura / Cierre: </span>
              <span className='italic'>&quot;{cashRegister.notes}&quot;</span>
            </div>
          </div>
        )}

        {/* Invoices Table for this Register */}
        <Card className='border shadow-sm'>
          <CardHeader className='pb-4 border-b'>
            <CardTitle className='text-base font-semibold'>
              Facturación y Recaudación de la Caja
            </CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              Listado completo de cobros emitidos durante esta sesión.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6 pt-5'>
            <CashRegisterInvoicesTable
              cashRegisterId={cashRegister.cashRegisterId}
              canCancelInvoice={false}
              onDeleteInvoice={() => refetch()}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
