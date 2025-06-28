'use client';

import NoticesDataTable from './notices-datatable';

export default function DashboardNoticesView() {
  return (
    <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
      <div className='grid grid-cols-1 gap-6'>
        <NoticesDataTable />
      </div>
    </div>
  );
}
