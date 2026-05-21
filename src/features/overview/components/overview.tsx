'use client';
import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useSessionContext } from '@/components/providers/session-Provider';
import { DashboardSummary } from './dashboard-summary';
import { LatestNews } from './latest-news';
import { PendingRequirements } from './pending-requirements';
import { RecentMovements } from './recent-movements';
import { MembersByNeighborhood } from './members-by-neighborhood';
import { MembersOverdueFees } from './members-overdue-fees';
import { UsersByRole } from './users-by-role';
import { DateRangeFilter } from './date-range-filter';

export default function OverViewPage() {
  const { session } = useSessionContext();
  const [dateRange, setDateRange] = useState<string | undefined>();
  const fullName = [session?.firstName, session?.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <PageContainer scrollable>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {fullName ? `Hola, ${fullName}` : 'Hola'}
            </h2>
            <p className='text-sm text-muted-foreground'>
              Resumen de actividad y métricas del sistema.
            </p>
          </div>
          <div className='w-full sm:w-auto sm:min-w-[420px]'>
            <DateRangeFilter onDateRangeChange={setDateRange} />
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <DashboardSummary />

        {/* Main Dashboard Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Columna 1: Noticias y Requisitos */}
          <div className='space-y-6 lg:col-span-2'>
            <LatestNews limit={5} dateRange={dateRange} />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <PendingRequirements limit={5} dateRange={dateRange} />
              <MembersOverdueFees limit={5} dateRange={dateRange} />
            </div>
            <RecentMovements limit={8} dateRange={dateRange} />
          </div>
          {/* Columna 2: Gráficos */}
          <div className='space-y-6'>
            <MembersByNeighborhood dateRange={dateRange} />
            <UsersByRole dateRange={dateRange} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
