"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo, useCallback } from "react";
import { MembersTableToolbar } from "./members-table-toolbar";
import { MembersTablePagination } from "./members-table-pagination";
import MembersTable from "./members-table";

type Member = {
  memberId: string;
  personId: string;
  fullName: string;
  houseNumber: string;
  joinDate: string;
  status: string;
  documents: number;
  annualFeePaid: boolean;
};

// Example data for comuneros
const members: Member[] = [
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

export default function MembersDataTable() {
  // State for search, sorting, pagination
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState<{ id: keyof Member; desc: boolean }[]>([
    { id: "fullName", desc: false }
  ]);
  const [loading, setLoading] = useState(false);

  // Filtering
  const filtered = useMemo(() =>
    members.filter(c => c.fullName.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  // Sorting
  const sorted = useMemo(() => {
    if (!sorting.length) return filtered;
    const { id, desc } = sorting[0];
    return [...filtered].sort((a, b) => {
      const aValue = a[id];
      const bValue = b[id];
      if (aValue < bValue) return desc ? 1 : -1;
      if (aValue > bValue) return desc ? -1 : 1;
      return 0;
    });
  }, [filtered, sorting]);

  // Pagination
  const pageCount = Math.ceil(sorted.length / pageSize);
  const paginated = useMemo(() =>
    sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [sorted, pageIndex, pageSize]
  );

  // Handlers
  const handleSortingChange = useCallback((col: keyof Member) => {
    setSorting(prev => {
      if (prev.length && prev[0].id === col) {
        return [{ id: col, desc: !prev[0].desc }];
      }
      return [{ id: col, desc: false }];
    });
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Comuneros</CardTitle>
      </CardHeader>
      <CardContent>
        <MembersTable
          data={paginated}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          isLoading={loading}
        />
      </CardContent>
    </Card>
  );
} 