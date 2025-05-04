import React from 'react';
import RequirementsTable from './dashboard/admin/requirements-table';
import AnnualFeesTable from './dashboard/admin/annual-fees-table';

export default function AdminView() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 space-y-8 max-w-[1200px]">
      {/* Section: Requirements to become a member */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Requisitos para ser comunero</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors">
            + Nuevo requisito
          </button>
        </div>
        <RequirementsTable />
      </section>

      {/* Section: Annual fees */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Cuotas anuales</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors">
            + Nueva cuota
          </button>
        </div>
        <AnnualFeesTable />
      </section>
    </div>
  );
} 