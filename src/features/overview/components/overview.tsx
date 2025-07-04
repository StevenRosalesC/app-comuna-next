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

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hola, bienvenido de nuevo 👋{' '}
            <span className='font-semibold capitalize'>
              {session?.lastName + ' ' + session?.firstName}
            </span>
          </h2>
        </div>

        {/* Date Range Filter */}
        <div className="max-w-md">
          <DateRangeFilter onDateRangeChange={setDateRange} />
        </div>

        {/* Dashboard Summary Cards */}
        <DashboardSummary />

        {/* Main Dashboard Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          style={{ alignItems: 'start' }}
        >
          {/* Columna 1: Noticias y Requisitos */}
          <div className="space-y-6 lg:col-span-2">
            <LatestNews limit={5} dateRange={dateRange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PendingRequirements limit={5} dateRange={dateRange} />
              <MembersOverdueFees limit={5} dateRange={dateRange} />
            </div>
            <RecentMovements limit={8} dateRange={dateRange} />
          </div>
          {/* Columna 2: Gráficos */}
          <div className="space-y-6">
            <MembersByNeighborhood dateRange={dateRange} />
            <UsersByRole dateRange={dateRange} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
