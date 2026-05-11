// Table component for comuneros (members)
// Comments in English as requested
'use client';

import { flexRender, Table } from '@tanstack/react-table';
import { Member } from '@/interfaces/members';

interface MembersTableProps {
  table: Table<Member>;
  columns: any[];
  isLoading: boolean;
}

export default function MembersTable({
  table,
  columns,
  isLoading
}: MembersTableProps) {
  return (
    <div className='w-full overflow-x-auto rounded-md border'>
      <table className='w-full min-w-[640px] text-xs sm:text-sm'>
        <thead className='bg-muted/40'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-4 py-2 text-left font-semibold text-muted-foreground'
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
        <tbody className='divide-y'>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className='py-10 text-center'>
                <div className='text-sm text-muted-foreground'>Cargando...</div>
              </td>
            </tr>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='transition-colors hover:bg-muted/30'
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='whitespace-nowrap px-4 py-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className='py-12 text-center'>
                <div className='space-y-1'>
                  <div className='text-sm font-medium'>
                    No hay comuneros registrados
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Cuando existan comuneros, aparecerán en esta lista.
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
