'use client';

import React, { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RequirementsTable from './dashboard/admin/requirements-table';
import AnnualFeesTable from './dashboard/admin/annual-fees-table';
import DocumentTypesTable from './dashboard/admin/document-types-table';
import NeighborhoodsTable from './dashboard/admin/neighborhoods-table';
import {
  ClipboardCheck,
  CircleDollarSign,
  IdCard,
  Building2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { getAnnualFees } from '@/services/annual-fee';
import { documentTypesService } from '@/services/document-types';
import { neighborhoodsService } from '@/services/neighborhoods';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('requirements');

  // Quick stats queries
  const { data: reqData, isLoading: reqLoading } = useQuery({
    queryKey: ['requirements-stats'],
    queryFn: () => requirementsService.list(1, 0)
  });

  const { data: feesData, isLoading: feesLoading } = useQuery({
    queryKey: ['annual-fees-stats'],
    queryFn: () => getAnnualFees({ limit: 1, offset: 0 })
  });

  const { data: docData, isLoading: docLoading } = useQuery({
    queryKey: ['doc-types-stats'],
    queryFn: () => documentTypesService.list(1, 0)
  });

  const { data: neighData, isLoading: neighLoading } = useQuery({
    queryKey: ['neighborhoods-stats'],
    queryFn: () =>
      neighborhoodsService.getNeighborhoods({
        limit: 1,
        offset: 0
      })
  });

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <Heading
            title='Panel de Administración'
            description='Gestión centralizada de parámetros comunales, requisitos de membresía, cuotas anuales, tipos de documentos y barrios.'
          />
        </div>
        <Separator />

        {/* KPI Summary Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Requisitos */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === 'requirements' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTab('requirements')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Requisitos</CardTitle>
              <ClipboardCheck className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {reqLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{reqData?.count ?? 0}</div>
              )}
              <CardDescription className='text-xs'>
                Requisitos para ser comunero
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2: Cuotas Anuales */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === 'annual-fees' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTab('annual-fees')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Cuotas Anuales</CardTitle>
              <CircleDollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {feesLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{feesData?.count ?? 0}</div>
              )}
              <CardDescription className='text-xs'>
                Periodos configurados
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3: Tipos de Documentos */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === 'document-types' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTab('document-types')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Tipos de Documento</CardTitle>
              <IdCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {docLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{docData?.count ?? 0}</div>
              )}
              <CardDescription className='text-xs'>
                Documentos admitidos
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 4: Barrios */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === 'neighborhoods' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActiveTab('neighborhoods')}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Barrios</CardTitle>
              <Building2 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              {neighLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{neighData?.count ?? 0}</div>
              )}
              <CardDescription className='text-xs'>
                Sectores registrados
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full space-y-4'
        >
          <TabsList className='grid w-full grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-2'>
            <TabsTrigger value='requirements' className='flex items-center gap-2'>
              <ClipboardCheck className='h-4 w-4' />
              <span>Requisitos</span>
            </TabsTrigger>
            <TabsTrigger value='annual-fees' className='flex items-center gap-2'>
              <CircleDollarSign className='h-4 w-4' />
              <span>Cuotas Anuales</span>
            </TabsTrigger>
            <TabsTrigger value='document-types' className='flex items-center gap-2'>
              <IdCard className='h-4 w-4' />
              <span>Tipos de Documentos</span>
            </TabsTrigger>
            <TabsTrigger value='neighborhoods' className='flex items-center gap-2'>
              <Building2 className='h-4 w-4' />
              <span>Barrios</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Requirements */}
          <TabsContent value='requirements' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <RequirementsTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Annual Fees */}
          <TabsContent value='annual-fees' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <AnnualFeesTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Document Types */}
          <TabsContent value='document-types' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <DocumentTypesTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Neighborhoods */}
          <TabsContent value='neighborhoods' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <NeighborhoodsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
