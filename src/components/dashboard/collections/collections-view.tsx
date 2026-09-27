'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  DollarSign,
  Heart,
  PiggyBank,
  Megaphone,
  CheckCircle2,
  Lock,
  UserCheck,
  User,
  FileText,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collectionsService } from '@/services/collections';
import { CreateCollectionDialog } from './create-collection-dialog';
import { CollectionReasonType } from '@/interfaces/collections';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidModules, ValidActions } from '@/constants/permissions';

export function CollectionsView() {
  const { permissions } = usePermissionsStore();
  const canCreate = permissions?.[ValidModules.COLLECTIONS]?.includes(
    ValidActions.CREATE_COLLECTION
  ) ?? true;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('ALL');
  const [isExportingGeneralPdf, setIsExportingGeneralPdf] = useState(false);
  const [exportingCardId, setExportingCardId] = useState<string | null>(null);

  // Fetch collections
  const {
    data: collectionsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['collections-list'],
    queryFn: () => collectionsService.getCollections({ limit: 100 })
  });

  const collections = collectionsData?.data || [];

  // General PDF Report Download
  const handleExportGeneralPdf = async () => {
    setIsExportingGeneralPdf(true);
    try {
      await collectionsService.downloadCollectionsGeneralReportPdf();
      toast.success('¡Informe General Consolidado PDF descargado! 📄');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Error al descargar el informe consolidado en PDF'
      );
    } finally {
      setIsExportingGeneralPdf(false);
    }
  };

  // Specific Collection PDF Report Download
  const handleExportCardPdf = async (collectionId: string, title?: string) => {
    setExportingCardId(collectionId);
    try {
      await collectionsService.downloadCollectionReportPdf(collectionId, title);
      toast.success(`¡Informe PDF de "${title || 'Colecta'}" descargado! 📄`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Error al descargar el informe PDF de la colecta'
      );
    } finally {
      setExportingCardId(null);
    }
  };

  // Filter collections
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      // Tab filter
      if (activeTab === 'ACTIVE' && c.collectionStatus !== 'ACTIVE') return false;
      if (activeTab === 'CLOSED' && c.collectionStatus !== 'CLOSED') return false;

      // Reason filter
      if (selectedReason !== 'ALL' && c.reasonType !== selectedReason) return false;

      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = c.title?.toLowerCase().includes(query);
        const nameMatch = c.beneficiaryName?.toLowerCase().includes(query);
        const notesMatch = c.notes?.toLowerCase().includes(query);
        if (!titleMatch && !nameMatch && !notesMatch) return false;
      }

      return true;
    });
  }, [collections, activeTab, selectedReason, searchTerm]);

  // Financial KPI totals
  const stats = useMemo(() => {
    const totalActive = collections.filter((c) => c.collectionStatus === 'ACTIVE').length;
    const totalCollected = collections.reduce(
      (acc, c) => acc + Number(c.summary?.totalCollected || 0),
      0
    );
    const totalRetained = collections.reduce(
      (acc, c) =>
        acc +
        Number(
          c.summary?.retainedForFund ||
            (Number(c.summary?.totalCollected || 0) * (c.fundRetentionPercentage || 10)) / 100
        ),
      0
    );
    const totalBeneficiaries = collections.length;

    return {
      totalActive,
      totalCollected,
      totalRetained,
      totalBeneficiaries
    };
  }, [collections]);

  const getReasonBadge = (reason: CollectionReasonType | string) => {
    switch (reason) {
      case 'HEALTH':
        return (
          <Badge className='bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px]'>
            Salud / Enfermedad
          </Badge>
        );
      case 'DEATH':
        return (
          <Badge className='bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[11px]'>
            Fallecimiento
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='text-[11px]'>
            Solidario
          </Badge>
        );
    }
  };

  return (
    <PageContainer scrollable>
      <div className='space-y-6 pb-12'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Heading
            title='Colectas Solidarias'
            description='Módulo para gestión de colectas, mesa de recaudación en vivo, locución y liquidación hacia fondos comunales.'
          />
          <div className='flex items-center gap-2.5 flex-wrap'>
            <Button
              variant='outline'
              onClick={handleExportGeneralPdf}
              disabled={isExportingGeneralPdf}
              className='shadow-xs border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-semibold text-xs sm:text-sm'
            >
              {isExportingGeneralPdf ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <FileText className='mr-2 h-4 w-4' />
              )}
              Informe General PDF
            </Button>

            {canCreate && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className='shadow-sm text-xs sm:text-sm'
              >
                <Plus className='mr-2 h-4 w-4' />
                Nueva Colecta
              </Button>
            )}
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1 */}
          <Card className='shadow-xs border-emerald-500/20 bg-emerald-500/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Colectas Activas
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'>
                <Megaphone className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-emerald-600 dark:text-emerald-400'>
                {stats.totalActive}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                En proceso de recaudación
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className='shadow-xs border-blue-500/20 bg-blue-500/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Total Recaudado
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400'>
                <DollarSign className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-blue-600 dark:text-blue-400'>
                ${stats.totalCollected.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Acumulado histórico
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className='shadow-xs border-purple-500/20 bg-purple-500/5'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Retención Fondos
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400'>
                <PiggyBank className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-purple-600 dark:text-purple-400'>
                ${stats.totalRetained.toFixed(2)}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Transferido a fondos comunales
              </p>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className='shadow-xs'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Familias Apoyadas
              </CardTitle>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Heart className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-foreground'>
                {stats.totalBeneficiaries}
              </div>
              <p className='text-[11px] text-muted-foreground mt-1'>
                Beneficiarios directos e indirectos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar & Tabs */}
        <div className='rounded-2xl border bg-card p-4 space-y-4 shadow-xs'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full sm:w-auto'
            >
              <TabsList className='grid grid-cols-3 w-full sm:w-auto'>
                <TabsTrigger value='ALL' className='text-xs'>
                  Todas ({collections.length})
                </TabsTrigger>
                <TabsTrigger value='ACTIVE' className='text-xs'>
                  Activas ({stats.totalActive})
                </TabsTrigger>
                <TabsTrigger value='CLOSED' className='text-xs'>
                  Cerradas ({collections.length - stats.totalActive})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filter controls */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 sm:justify-end'>
              <div className='relative w-full sm:w-64'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar por título, beneficiario...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-9 h-9 text-xs rounded-xl'
                />
              </div>

              <Select
                value={selectedReason}
                onValueChange={setSelectedReason}
              >
                <SelectTrigger className='w-full sm:w-48 h-9 text-xs rounded-xl'>
                  <SelectValue placeholder='Motivo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>Todos los motivos</SelectItem>
                  <SelectItem value='HEALTH'>Salud / Enfermedad</SelectItem>
                  <SelectItem value='DEATH'>Fallecimiento</SelectItem>
                  <SelectItem value='OTHER'>Otros motivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Collection Cards Grid */}
        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {[1, 2, 3].map((i) => (
              <Card key={i} className='p-5 space-y-4 rounded-2xl'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-20 w-full rounded-xl' />
                <Skeleton className='h-9 w-full rounded-xl' />
              </Card>
            ))}
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className='rounded-2xl border bg-card p-12 text-center text-muted-foreground space-y-3 shadow-xs'>
            <Megaphone className='mx-auto h-12 w-12 text-muted-foreground/30' />
            <h3 className='font-semibold text-foreground text-base'>
              No se encontraron colectas
            </h3>
            <p className='text-xs max-w-sm mx-auto'>
              No hay registros que coincidan con los filtros de búsqueda seleccionados.
            </p>
            {canCreate && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCreateDialogOpen(true)}
                className='mt-2'
              >
                <Plus className='mr-1.5 h-3.5 w-3.5' />
                Crear Primera Colecta
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filteredCollections.map((c) => {
              const isClosed = c.collectionStatus === 'CLOSED';
              const totalCollected = Number(c.summary?.totalCollected || 0);
              const totalExpected = Number(c.summary?.totalExpected || 1);
              const progressPercentage = Math.min(
                100,
                Math.round((totalCollected / (totalExpected || 1)) * 100)
              );
              const isExportingThis = exportingCardId === c.collectionId;

              return (
                <Card
                  key={c.collectionId}
                  className={`rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                    isClosed
                      ? 'border-slate-300 dark:border-slate-800 bg-card/60'
                      : 'border-emerald-500/30 bg-card'
                  }`}
                >
                  <CardHeader className='p-5 pb-3 space-y-2.5'>
                    <div className='flex items-center justify-between gap-2'>
                      {getReasonBadge(c.reasonType)}
                      {isClosed ? (
                        <Badge variant='secondary' className='text-[10px] text-muted-foreground gap-1'>
                          <Lock className='h-3 w-3' />
                          Cerrada
                        </Badge>
                      ) : (
                        <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] animate-pulse'>
                          Activa 📢
                        </Badge>
                      )}
                    </div>

                    <div>
                      <CardTitle className='text-base font-bold text-foreground line-clamp-1'>
                        {c.title}
                      </CardTitle>
                      <CardDescription className='text-xs mt-1 flex items-center gap-1 text-muted-foreground'>
                        {c.beneficiaryMemberId ? (
                          <UserCheck className='h-3.5 w-3.5 text-primary shrink-0' />
                        ) : (
                          <User className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                        )}
                        <span className='truncate font-medium text-foreground'>
                          {c.beneficiaryName}
                        </span>
                        {c.beneficiaryRelation && (
                          <span className='truncate text-[11px]'>
                            ({c.beneficiaryRelation})
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className='p-5 pt-0 space-y-4 text-xs flex-1'>
                    {/* Financial Progress */}
                    <div className='rounded-xl border bg-muted/20 p-3 space-y-2'>
                      <div className='flex items-center justify-between font-medium'>
                        <span className='text-muted-foreground'>Recaudado:</span>
                        <span className='text-sm font-bold text-foreground'>
                          ${totalCollected.toFixed(2)}
                        </span>
                      </div>

                      <Progress value={progressPercentage} className='h-2' />

                      <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                        <span>Cuota base: ${Number(c.baseAmount || 5).toFixed(2)}</span>
                        <span>Fondo Común: {c.fundRetentionPercentage || 10}%</span>
                      </div>
                    </div>

                    {/* Operational counter badges */}
                    {c.summary && (
                      <div className='grid grid-cols-3 gap-1 text-center text-[10px] text-muted-foreground pt-1'>
                        <div className='rounded-lg bg-muted/40 p-1.5'>
                          <div className='font-bold text-amber-600 dark:text-amber-400'>
                            {c.summary.countPending || 0}
                          </div>
                          <span>Pendientes</span>
                        </div>
                        <div className='rounded-lg bg-muted/40 p-1.5'>
                          <div className='font-bold text-emerald-600 dark:text-emerald-400'>
                            {c.summary.countPaid || 0}
                          </div>
                          <span>Pagados</span>
                        </div>
                        <div className='rounded-lg bg-muted/40 p-1.5'>
                          <div className='font-bold text-blue-600 dark:text-blue-400'>
                            {c.summary.countAnnounced || 0}
                          </div>
                          <span>Anunciados</span>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <div className='p-4 pt-0 border-t bg-muted/10 flex items-center gap-2'>
                    <Button
                      asChild
                      className={`flex-1 text-xs font-semibold h-9 ${
                        !isClosed
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'variant-outline'
                      }`}
                    >
                      <Link href={`/dashboard/collections/${c.collectionId}`}>
                        {!isClosed ? (
                          <>
                            <Megaphone className='mr-1.5 h-3.5 w-3.5' />
                            Abrir Mesa 📢
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className='mr-1.5 h-3.5 w-3.5' />
                            Ver Balance 📊
                          </>
                        )}
                      </Link>
                    </Button>

                    <Button
                      variant='outline'
                      size='icon'
                      title='Descargar Informe PDF Oficial'
                      onClick={() => handleExportCardPdf(c.collectionId, c.title)}
                      disabled={isExportingThis}
                      className='h-9 w-9 shrink-0 border-blue-500/30 text-blue-600 hover:bg-blue-500/10'
                    >
                      {isExportingThis ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <FileText className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Dialog */}
        <CreateCollectionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={() => refetch()}
        />
      </div>
    </PageContainer>
  );
}
