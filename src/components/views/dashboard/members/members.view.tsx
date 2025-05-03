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
    <div className="container mx-auto px-2 sm:px-4 py-4 space-y-6 max-w-[1400px]">
      {/* Summary cards and new member button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Activos</div>
            <div className="text-2xl font-bold text-green-600">{summary.totalActive}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Inactivos</div>
            <div className="text-2xl font-bold text-red-600">{summary.totalInactive}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Cuotas pagadas</div>
            <div className="text-2xl font-bold text-green-600">{summary.totalPaid}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Cuotas pendientes</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.totalPending}</div>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors w-full md:w-auto">+ Nuevo Comunero</button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          {/* Aquí irá el formulario para añadir comuneros */}
        </div>
        <MembersActionsSection />
        <div className="w-full overflow-hidden">
          <MembersDataTable />
        </div>
      </div>
    </div>
  );
} 