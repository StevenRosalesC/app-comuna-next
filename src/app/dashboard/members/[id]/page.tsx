'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getMemberById, getMemberFeesStatus } from '@/services/members';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';
import PageContainer from '@/components/layout/page-container';
import MemberPayment from '@/components/dashboard/members/member-payment';
import { PaymentHistoryTable } from '@/components/dashboard/members/payment-history-table';
import DocumentUpload from '@/components/dashboard/members/document-upload';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Pencil,
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  DollarSign,
  Receipt,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  IdCard,
  Building2,
  FileCheck2,
  Sparkles
} from 'lucide-react';

function MemberPageSkeleton() {
  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Top bar skeleton */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-9 w-40' />
          <Skeleton className='h-9 w-32' />
        </div>

        {/* Profile Card Skeleton */}
        <Card className='overflow-hidden border'>
          <CardHeader className='pb-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-16 w-16 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-7 w-56' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-5 w-28' />
                    <Skeleton className='h-5 w-20' />
                  </div>
                </div>
              </div>
              <Skeleton className='h-7 w-24 rounded-full' />
            </div>
          </CardHeader>
          <CardContent className='pt-2 border-t bg-muted/20'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 py-2'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='space-y-1.5'>
                  <Skeleton className='h-3.5 w-16' />
                  <Skeleton className='h-4 w-28' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards Skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='p-4 space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-7 w-20' />
              <Skeleton className='h-3 w-36' />
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full sm:w-96 rounded-lg' />
          <Card className='p-6'>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-80' />
              <Skeleton className='h-32 w-full rounded-lg' />
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default function MemberPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('payment');

  const canReadHistoryPayments = usePermission(ValidModules.MEMBERS, [
    ValidActions.READ_HISTORY_PAYMENTS
  ]);
  const canCreatePayment = usePermission(ValidModules.MEMBERS, [
    ValidActions.CREATE_PAYMENT
  ]);

  const {
    data: member,
    isLoading,
    error
  } = useQuery({
    queryKey: ['members', params.id],
    queryFn: () => getMemberById(params.id),
    enabled: !!params.id
  });

  const { data: feesStatus } = useQuery({
    queryKey: ['memberFeesStatus', params.id],
    queryFn: () => getMemberFeesStatus(params.id),
    enabled: !!params.id
  });

  // Calculate quick metrics
  const { totalFees, pendingFeesCount, paidFeesCount, totalPaidAmount } = useMemo(() => {
    if (!feesStatus?.fees) {
      return { totalFees: 0, pendingFeesCount: 0, paidFeesCount: 0, totalPaidAmount: 0 };
    }
    const fees = feesStatus.fees;
    const totalFees = fees.length;
    const paidFeesCount = fees.filter((f) => f.status === 'PAID').length;
    const pendingFeesCount = fees.filter((f) => f.status === 'PENDING' || f.status === 'PARTIAL').length;
    const totalPaidAmount = fees.reduce((acc, f) => acc + (Number(f.amountPaid) || 0), 0);

    return { totalFees, pendingFeesCount, paidFeesCount, totalPaidAmount };
  }, [feesStatus]);

  if (isLoading) {
    return <MemberPageSkeleton />;
  }

  if (error || !member) {
    return (
      <PageContainer scrollable>
        <div className='flex flex-col items-center justify-center min-h-[400px] gap-4 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <AlertCircle className='h-8 w-8' />
          </div>
          <div className='space-y-1 max-w-sm'>
            <h3 className='text-lg font-semibold'>Comunero no encontrado</h3>
            <p className='text-sm text-muted-foreground'>
              No se pudo cargar la información del comunero o el registro no existe.
            </p>
          </div>
          <Button asChild variant='outline' size='sm'>
            <Link href='/dashboard/members'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Volver a comuneros
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const { person } = member;
  const isActive = Boolean(
    member.status === true ||
    member.status === 'active' ||
    (member.status as any) === 'ACTIVE' ||
    member.status === 1
  );
  const initials = `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase();

  return (
    <PageContainer scrollable>
      <div className='space-y-6 pb-8'>
        {/* Navigation & Header Actions */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <Button variant='ghost' size='sm' asChild className='w-fit -ml-2 text-muted-foreground hover:text-foreground'>
            <Link href='/dashboard/members'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Volver a comuneros
            </Link>
          </Button>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' asChild className='text-xs h-9 gap-1.5'>
              <Link href={`/dashboard/members/${member.memberId}/edit`}>
                <Pencil className='h-3.5 w-3.5' /> Editar comunero
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Profile Card */}
        <Card className='overflow-hidden border shadow-sm'>
          <div className='h-2.5 bg-gradient-to-r from-primary/80 via-primary to-primary/60' />
          <CardHeader className='pb-4'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-inner border border-primary/20 shrink-0'>
                  {initials || <User className='h-8 w-8' />}
                </div>
                <div className='space-y-1 min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h1 className='text-2xl font-bold tracking-tight text-foreground truncate'>
                      {person.firstName} {person.lastName}
                    </h1>
                    <Badge
                      variant={isActive ? 'default' : 'destructive'}
                      className={`text-xs py-0.5 font-medium ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                          : ''
                      }`}
                    >
                      {isActive ? 'Comunero Activo' : 'Comunero Inactivo'}
                    </Badge>
                  </div>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium'>
                    <span className='flex items-center gap-1 font-mono'>
                      <IdCard className='h-3.5 w-3.5' /> {person.identification}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Home className='h-3.5 w-3.5' /> Casa #{member.houseNumber || 'S/N'}
                    </span>
                    {person.hasDisability && (
                      <Badge variant='outline' className='text-[11px] bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 py-0'>
                        Discapacidad: {person.disabilityPercentage || 0}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Quick Info Grid */}
          <CardContent className='pt-3 border-t bg-muted/20'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
              <div className='space-y-0.5'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Mail className='h-3.5 w-3.5 text-muted-foreground/70' /> Email
                </span>
                <p className='font-medium text-foreground truncate'>
                  {person.email || 'No registrado'}
                </p>
              </div>

              <div className='space-y-0.5'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Phone className='h-3.5 w-3.5 text-muted-foreground/70' /> Teléfono
                </span>
                <p className='font-medium text-foreground'>
                  {person.phoneNumber || 'No registrado'}
                </p>
              </div>

              <div className='space-y-0.5'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Calendar className='h-3.5 w-3.5 text-muted-foreground/70' /> Fecha de ingreso
                </span>
                <p className='font-medium text-foreground'>
                  {new Date(member.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className='space-y-0.5'>
                <span className='text-muted-foreground flex items-center gap-1'>
                  <User className='h-3.5 w-3.5 text-muted-foreground/70' /> Nacimiento / Género
                </span>
                <p className='font-medium text-foreground'>
                  {new Date(person.birthDate).toLocaleDateString('es-ES')} •{' '}
                  {person.gender === 1 ? 'M' : 'F'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick KPI Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* Card 1: Cuotas al día / pendientes */}
          <Card className='border shadow-sm p-4 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-xs font-medium text-muted-foreground'>Cuotas Registradas</p>
              <p className='text-2xl font-bold text-foreground'>{totalFees}</p>
              <p className='text-[11px] text-muted-foreground'>
                {paidFeesCount} al día •{' '}
                <span className={pendingFeesCount > 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
                  {pendingFeesCount} pendiente{pendingFeesCount !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
            <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='h-5 w-5' />
            </div>
          </Card>

          {/* Card 2: Total abonado */}
          <Card className='border shadow-sm p-4 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-xs font-medium text-muted-foreground'>Total Recaudado</p>
              <p className='text-2xl font-bold text-foreground'>
                ${totalPaidAmount.toFixed(2)}
              </p>
              <p className='text-[11px] text-muted-foreground'>Monto acumulado en cuotas</p>
            </div>
            <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
              <DollarSign className='h-5 w-5' />
            </div>
          </Card>

          {/* Card 3: Documentos */}
          <Card className='border shadow-sm p-4 flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-xs font-medium text-muted-foreground'>Expediente Digital</p>
              <p className='text-2xl font-bold text-foreground'>
                {member.memberDocumentTypes?.length || 0}
              </p>
              <p className='text-[11px] text-muted-foreground'>Tipos de documentos asociados</p>
            </div>
            <div className='h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400'>
              <FileCheck2 className='h-5 w-5' />
            </div>
          </Card>
        </div>

        {/* Tabbed Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full space-y-4'>
          <TabsList className='grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto p-1 bg-muted/60'>
            {canCreatePayment && (
              <TabsTrigger value='payment' className='text-xs py-2 gap-1.5'>
                <DollarSign className='h-4 w-4' /> Registrar Pago
              </TabsTrigger>
            )}
            {canReadHistoryPayments && (
              <TabsTrigger value='history' className='text-xs py-2 gap-1.5'>
                <Receipt className='h-4 w-4' /> Historial de Recibos
              </TabsTrigger>
            )}
            <TabsTrigger value='documents' className='text-xs py-2 gap-1.5'>
              <FolderOpen className='h-4 w-4' /> Expediente Digital
            </TabsTrigger>
            <TabsTrigger value='details' className='text-xs py-2 gap-1.5'>
              <User className='h-4 w-4' /> Ficha Completa
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Registrar Pago */}
          {canCreatePayment && (
            <TabsContent value='payment' className='space-y-4 outline-none'>
              <MemberPayment member={member} />
            </TabsContent>
          )}

          {/* Tab 2: Historial de Pagos y Recibos */}
          {canReadHistoryPayments && (
            <TabsContent value='history' className='space-y-4 outline-none'>
              <PaymentHistoryTable memberId={member.memberId} />
            </TabsContent>
          )}

          {/* Tab 3: Documentos del Comunero */}
          <TabsContent value='documents' className='space-y-4 outline-none'>
            <DocumentUpload memberId={member.memberId} />
          </TabsContent>

          {/* Tab 4: Ficha Completa del Comunero */}
          <TabsContent value='details' className='space-y-4 outline-none'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Personal Details */}
              <Card className='border shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <User className='h-4 w-4 text-primary' /> Información Personal
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Datos de identidad y contacto del comunero.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 text-xs'>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Nombres y Apellidos:</span>
                    <span className='font-medium text-foreground'>{person.firstName} {person.lastName}</span>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Cédula de Identidad:</span>
                    <span className='font-mono font-medium text-foreground'>{person.identification}</span>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Género:</span>
                    <span className='font-medium text-foreground'>{person.gender === 1 ? 'Masculino' : 'Femenino'}</span>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Fecha de Nacimiento:</span>
                    <span className='font-medium text-foreground'>
                      {new Date(person.birthDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Correo Electrónico:</span>
                    <span className='font-medium text-foreground'>{person.email || 'No registrado'}</span>
                  </div>
                  <div className='flex justify-between py-1.5'>
                    <span className='text-muted-foreground'>Teléfono de Contacto:</span>
                    <span className='font-medium text-foreground'>{person.phoneNumber || 'No registrado'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Details */}
              <Card className='border shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <Building2 className='h-4 w-4 text-primary' /> Información de Membresía
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Estado de afiliación a la comuna y vivienda.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 text-xs'>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>ID de Comunero:</span>
                    <span className='font-mono text-muted-foreground truncate max-w-[180px]'>{member.memberId}</span>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Número de Casa:</span>
                    <Badge variant='outline' className='font-medium'>
                      Casa #{member.houseNumber || 'S/N'}
                    </Badge>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Estado de Membresía:</span>
                    <Badge
                      className={
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                          : 'bg-destructive text-destructive-foreground'
                      }
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className='flex justify-between py-1.5 border-b'>
                    <span className='text-muted-foreground'>Fecha de Registro:</span>
                    <span className='font-medium text-foreground'>
                      {new Date(member.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between py-1.5'>
                    <span className='text-muted-foreground'>Condición Especial:</span>
                    <span className='font-medium text-foreground'>
                      {person.hasDisability
                        ? `Carnet de discapacidad (${person.disabilityPercentage || 0}%)`
                        : 'Ninguna'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
