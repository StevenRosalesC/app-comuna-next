// Table component for comuneros (members)
// Comments in English as requested
'use client';

import React from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import { Member } from '@/interfaces/members';

interface MembersTableProps {
  table: Table<Member>;
  columns: any[];
  isLoading: boolean;
  pageSize: number;
}

export default function MembersTable({
  table,
  columns,
  isLoading,
  pageSize
}: MembersTableProps) {
  return (
    <div className='overflow-x-auto rounded-md border'>
      <table className='min-w-[640px] text-xs sm:text-sm'>
        <thead className='bg-gray-50'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-4 py-2 text-left font-semibold text-gray-700'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className='py-8 text-center'>
                Cargando...
              </td>
            </tr>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='transition-colors hover:bg-gray-50'>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='whitespace-nowrap px-4 py-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className='py-8 text-center'>
                No hay comuneros registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
