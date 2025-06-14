// Main view for the comuneros module
// Comments in English as requested

import MembersDataTable from '@/components/dashboard/members/members-datatable';
import MembersActionsSection from '@/components/dashboard/members/membersActionsSection';
import React from 'react';

// Example summary data
const summary = {
  totalActive: 2,
  totalInactive: 1,
  totalPaid: 1,
  totalPending: 2,
  totalDocuments: 6
};

export default function MembersDashboardView() {
  return (
    <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
      {/* Summary cards and new member button */}
      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='grid flex-1 grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-white p-4 text-center shadow'>
            <div className='mb-1 text-xs text-gray-500'>Activos</div>
            <div className='text-2xl font-bold text-green-600'>
              {summary.totalActive}
            </div>
          </div>
          <div className='rounded-lg bg-white p-4 text-center shadow'>
            <div className='mb-1 text-xs text-gray-500'>Inactivos</div>
            <div className='text-2xl font-bold text-red-600'>
              {summary.totalInactive}
            </div>
          </div>
          <div className='rounded-lg bg-white p-4 text-center shadow'>
            <div className='mb-1 text-xs text-gray-500'>Cuotas pagadas</div>
            <div className='text-2xl font-bold text-green-600'>
              {summary.totalPaid}
            </div>
          </div>
          <div className='rounded-lg bg-white p-4 text-center shadow'>
            <div className='mb-1 text-xs text-gray-500'>Cuotas pendientes</div>
            <div className='text-2xl font-bold text-yellow-600'>
              {summary.totalPending}
            </div>
          </div>
        </div>
        <button className='w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-primary/90 md:w-auto'>
          + Nuevo Comunero
        </button>
      </div>
      <div className='grid grid-cols-1 gap-6'>
        <div className='w-full'></div>
        <MembersActionsSection />
        <div className='w-full overflow-hidden'>
          <MembersDataTable />
        </div>
      </div>
    </div>
  );
}
