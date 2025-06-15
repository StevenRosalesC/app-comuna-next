import React from 'react';
import RequirementsTable from './dashboard/admin/requirements-table';
import AnnualFeesTable from './dashboard/admin/annual-fees-table';

export default function AdminView() {
  return (
    <div className='container mx-auto max-w-[1200px] space-y-8 px-2 py-4 sm:px-4'>
      {/* Section: Requirements to become a member */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <RequirementsTable />
      </section>

      {/* Section: Annual fees */}
      <section className='rounded-lg bg-white p-6 shadow'>
        <AnnualFeesTable />
      </section>
    </div>
  );
}
