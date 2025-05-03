'use client';
import { useMembersStore } from '@/hooks/store/useMembersStore';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/interfaces/members';

const PAGE_SIZE_DEFAULT = 10;

const MembersDataTable = () => {
  const { members, isLoading, fetchMembers, count } = useMembersStore((state) => ({
    members: state.members,
    isLoading: state.isLoading,
    fetchMembers: state.fetchMembers,
    count: state.count
  }));

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const fetchData = useCallback(async () => {
    await fetchMembers(); // Aquí podrías pasar filtros si el backend lo soporta
  }, [fetchMembers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  // Filtro local por nombre (puedes cambiarlo por filtro real si el backend lo soporta)
  const filteredMembers = members.filter(m =>
    m.memberId.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Miembros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar miembro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 w-full max-w-xs"
          />
        </div>
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <li className="py-4 text-center">Cargando...</li>
          ) : paginatedMembers.length === 0 ? (
            <li className="py-4 text-center">No hay miembros registrados.</li>
          ) : (
            paginatedMembers.map(member => (
              <li key={member.memberId} className="py-2 flex items-center justify-between">
                <span>ID: {member.memberId} | Estado: {member.status}</span>
                {/* Aquí puedes agregar acciones como editar, eliminar, etc. */}
              </li>
            ))
          )}
        </ul>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 rounded border"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Anterior
          </button>
          <span>Página {pageIndex + 1} de {pageCount}</span>
          <button
            className="px-3 py-1 rounded border"
            disabled={pageIndex + 1 >= pageCount}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Siguiente
          </button>
          <select
            className="ml-4 border rounded px-2 py-1"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size} por página</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersDataTable; 