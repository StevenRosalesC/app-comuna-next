import React from 'react';
import RequirementsTable from './dashboard/admin/requirements-table';
import AnnualFeesTable from './dashboard/admin/annual-fees-table';
import DocumentTypesTable from './dashboard/admin/document-types-table';

export default function AdminView() {
  return (
    <div className='container mx-auto max-w-[1200px] space-y-8 px-2 py-4 sm:px-4'>
      <div className='grid grid-cols-1 gap-4 '>
        {/* Section: Requirements to become a member */}
        <section className='rounded-lg border p-6 shadow'>
          <RequirementsTable />
        </section>

        {/* Section: Annual fees */}
        <section className='rounded-lg border p-6 shadow'>
          <AnnualFeesTable />
        </section>

        {/* Section: Document types */}
        <section className='rounded-lg border p-6 shadow'>
          <DocumentTypesTable />
        </section>
      </div>
    </div>
  );
}
