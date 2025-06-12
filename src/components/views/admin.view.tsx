import React from 'react';
import RequirementsTable from './dashboard/admin/requirements-table';
import AnnualFeesTable from './dashboard/admin/annual-fees-table';

export default function AdminView() {

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 space-y-8 max-w-[1200px]">
      {/* Section: Requirements to become a member */}
      <section className="bg-white rounded-lg shadow p-6">

        <RequirementsTable />
      </section>

      {/* Section: Annual fees */}
      <section className="bg-white rounded-lg shadow p-6">

        <AnnualFeesTable />
      </section>
    </div>
  );
} 