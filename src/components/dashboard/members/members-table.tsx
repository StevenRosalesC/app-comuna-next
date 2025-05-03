// Table component for comuneros (members)
// Comments in English as requested
'use client'

import React, { useState } from 'react';
import { MembersTableToolbar } from './members-table-toolbar';
import { MembersTablePagination } from './members-table-pagination';

// Example data for comuneros
const comuneros = [
  {
    memberId: '1',
    personId: 'P-001',
    fullName: 'Juan Pérez',
    houseNumber: '12A',
    joinDate: '2022-01-15',
    status: 'active',
    documents: 3,
    annualFeePaid: true
  },
  {
    memberId: '2',
    personId: 'P-002',
    fullName: 'María García',
    houseNumber: '8B',
    joinDate: '2021-06-10',
    status: 'active',
    documents: 2,
    annualFeePaid: false
  },
  {
    memberId: '3',
    personId: 'P-003',
    fullName: 'Carlos López',
    houseNumber: '5C',
    joinDate: '2023-03-20',
    status: 'inactive',
    documents: 1,
    annualFeePaid: false
  }
];

type Comunero = typeof comuneros[number];

interface MembersTableProps {
  data: Comunero[];
  sorting: { id: keyof Comunero; desc: boolean }[];
  onSortingChange: (col: keyof Comunero) => void;
  isLoading: boolean;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const columns: { key: keyof Comunero; label: string }[] = [
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'houseNumber', label: 'N° Casa' },
  { key: 'joinDate', label: 'Fecha ingreso' },
  { key: 'status', label: 'Estado' },
  { key: 'documents', label: 'Documentos' },
  { key: 'annualFeePaid', label: 'Cuota anual' },
];

export default function MembersTable({ data, sorting, onSortingChange, isLoading }: MembersTableProps) {
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const sortField = sorting.length ? sorting[0].id : undefined;
  const sortDir = sorting.length ? sorting[0].desc : false;

  // Filter, sort and paginate
  const filtered = data.filter(c => c.fullName.toLowerCase().includes(search.toLowerCase()));
  const sorted = sortField
    ? [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDir ? -1 : 1;
      if (aValue > bValue) return sortDir ? 1 : -1;
      return 0;
    })
    : filtered;
  const pageCount = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="overflow-x-auto m-4">
      <MembersTableToolbar search={search} onSearchChange={setSearch} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"> </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                  onClick={() => onSortingChange(col.key)}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span className="ml-1">{sortDir ? '▼' : '▲'}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={columns.length + 2} className="text-center py-8">Cargando...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="text-center py-8">No hay comuneros registrados.</td></tr>
            ) : paginated.map((comunero) => (
              <tr key={comunero.memberId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm" title={comunero.fullName}>
                    {getInitials(comunero.fullName)}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">{comunero.fullName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{comunero.houseNumber}</td>
                <td className="px-4 py-2 whitespace-nowrap">{comunero.joinDate}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comunero.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    title={comunero.status === 'active' ? 'Comunero activo' : 'Comunero inactivo'}>
                    {comunero.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold" title="Documentos registrados">
                    {comunero.documents}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {comunero.annualFeePaid ? (
                    <span className="text-green-600 font-bold" title="Cuota anual pagada">Pagada</span>
                  ) : (
                    <span className="text-red-600 font-bold" title="Cuota anual pendiente">Pendiente</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                  <button className="text-blue-600 hover:underline" title="Ver detalles">
                    <span role="img" aria-label="ver">👁️</span> Ver
                  </button>
                  <button className="text-yellow-600 hover:underline" title="Editar comunero">
                    <span role="img" aria-label="editar">✏️</span> Editar
                  </button>
                  <button className="text-red-600 hover:underline" title="Eliminar comunero">
                    <span role="img" aria-label="eliminar">🗑️</span> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left mb-2">
          {filtered.length} registros en total.
        </div>
        <MembersTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
} 