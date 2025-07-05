'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Database, Filter, Download } from 'lucide-react';
import { useInitialAnalytics, useAnalytics, useFilterOptions } from '@/hooks/useAnalytics';
import { AnalyticsQuery, PaginationParams } from '@/services/analytics';
import { SummaryStats } from './summary-stats';
import { FilterPanel } from './filter-panel';
import { DataTable } from './data-table';
import { Pagination } from './pagination';
import { ExportButton } from './export-button';
import { AnalyticsExportDialog } from './analytics-export-dialog';
import { useExport } from '@/hooks/useExport';

// QuickActions component for analytics
const QuickActions = ({ onSelect }: { onSelect: (filters: AnalyticsQuery) => void }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Acciones rápidas
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect({ membershipFilter: { status: 'active' } })}
        >
          Comuneros activos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect({ disabilityFilter: { hasDisability: true } })}
        >
          Con discapacidad
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect({ financialFilter: { feeStatus: 'PENDING' } })}
        >
          Cuotas pendientes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect({ requirementsFilter: { allApproved: true } })}
        >
          Todos los requisitos aprobados
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const SuperDataTable = () => {
  // State for view mode (initial vs filtered)
  const [viewMode, setViewMode] = useState<'initial' | 'filtered'>('initial');

  // State for pagination
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    limit: 20,
    offset: 0,
    search: '',
    orderBy: 'lastName',
    order: 'asc'
  });

  // State for filters
  const [filterParams, setFilterParams] = useState<AnalyticsQuery>({});

  // State for current sort
  const [currentSort, setCurrentSort] = useState({
    field: 'lastName',
    order: 'asc' as 'asc' | 'desc'
  });

  // Get filter options
  const { neighborhoods, requirements, loading: optionsLoading } = useFilterOptions();

  // Export hook
  const { exportToPDF } = useExport();

  // Hook for initial data
  const {
    data: initialData,
    summary: initialSummary,
    loading: initialLoading,
    error: initialError,
    totalCount: initialCount
  } = useInitialAnalytics(paginationParams);

  // Hook for filtered data
  const {
    data: filteredData,
    summary: filteredSummary,
    loading: filteredLoading,
    error: filteredError,
    totalCount: filteredCount
  } = useAnalytics(filterParams);

  // Current data based on view mode
  const currentData = viewMode === 'initial' ? initialData : filteredData;
  const currentSummary = viewMode === 'initial' ? initialSummary : filteredSummary;
  const currentLoading = viewMode === 'initial' ? initialLoading : filteredLoading;
  const currentError = viewMode === 'initial' ? initialError : filteredError;
  const currentCount = viewMode === 'initial' ? initialCount : filteredCount;

  // Calculate current page and total pages
  const currentPage = Math.floor((paginationParams.offset || 0) / (paginationParams.limit || 20)) + 1;
  const totalPages = Math.ceil(currentCount / (paginationParams.limit || 20));

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setPaginationParams(prev => ({
      ...prev,
      search: searchTerm,
      offset: 0
    }));
  };

  // Handle sorting
  const handleSort = (field: string) => {
    const newOrder = currentSort.field === field && currentSort.order === 'asc' ? 'desc' : 'asc';
    setCurrentSort({ field, order: newOrder });
    setPaginationParams(prev => ({
      ...prev,
      orderBy: field,
      order: newOrder,
      offset: 0
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (paginationParams.limit || 20);
    setPaginationParams(prev => ({ ...prev, offset: newOffset }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setPaginationParams(prev => ({
      ...prev,
      limit: pageSize,
      offset: 0
    }));
  };

  // Handle filter application
  const handleApplyFilters = (filters: AnalyticsQuery) => {
    const filtersWithPagination = {
      ...filters,
      limit: paginationParams.limit || 20,
      offset: 0,
      orderBy: paginationParams.orderBy || 'lastName',
      order: paginationParams.order || 'asc',
      search: paginationParams.search || ''
    };
    setFilterParams(filtersWithPagination);
    setViewMode('filtered');
  };

  // Handle filter clearing
  const handleClearFilters = () => {
    setFilterParams({});
    setViewMode('initial');
    setPaginationParams({
      limit: 20,
      offset: 0,
      search: '',
      orderBy: 'lastName',
      order: 'asc'
    });
  };

  // Handle view details
  const handleViewDetails = (personId: string) => {
    // Navigate to person details page
    window.open(`/dashboard/persons/${personId}`, '_blank');
  };

  // Handle export
  const handleExport = () => {
    // Convert current filters to export format
    const exportFilters: any[] = [];

    // Add search filter if exists
    if (paginationParams.search) {
      exportFilters.push({
        field: 'firstName',
        operator: 'contains' as const,
        value: paginationParams.search
      });
    }

    // Add current filters based on view mode
    if (viewMode === 'filtered' && filterParams) {
      // Convert analytics filters to export filters
      if (filterParams.membershipFilter?.status) {
        exportFilters.push({
          field: 'memberStatus',
          operator: 'equals' as const,
          value: filterParams.membershipFilter.status === 'active' ? 'ACTIVE' : 'INACTIVE'
        });
      }

      if (filterParams.gender) {
        exportFilters.push({
          field: 'gender',
          operator: 'equals' as const,
          value: filterParams.gender
        });
      }

      if (filterParams.disabilityFilter?.hasDisability) {
        exportFilters.push({
          field: 'hasDisability',
          operator: 'equals' as const,
          value: true
        });
      }

      if (filterParams.financialFilter?.feeStatus) {
        exportFilters.push({
          field: 'feeStatus',
          operator: 'equals' as const,
          value: filterParams.financialFilter.feeStatus
        });
      }
    }

    // Prepare export parameters
    const exportParams = {
      tableType: 'persons',
      title: `Reporte de Análisis - ${viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}`,
      filters: exportFilters,
      sorting: {
        field: currentSort.field,
        direction: currentSort.order
      },
      columns: [
        'identification',
        'firstName',
        'lastName',
        'birthDate',
        'email',
        'phone'
      ],
      limit: 1000
    };

    // Use the export service
    exportToPDF(exportParams);
  };

  // Update current sort when pagination params change
  useEffect(() => {
    setCurrentSort({
      field: paginationParams.orderBy || 'lastName',
      order: (paginationParams.order as 'asc' | 'desc') || 'asc'
    });
  }, [paginationParams.orderBy, paginationParams.order]);

  // Synchronize quick actions with filters
  const handleQuickAction = (filters: AnalyticsQuery) => {
    setFilterParams(filters);
    setViewMode('filtered');
    setPaginationParams(prev => ({
      ...prev,
      offset: 0
    }));
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions at the top */}
      <QuickActions onSelect={handleQuickAction} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super DataTable Analytics</h1>
          <p className="text-muted-foreground">
            Análisis avanzado de datos y filtrado para obtener insights completos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            {currentCount.toLocaleString()} Registros totales
          </Badge>
        </div>
      </div>

      {/* Export buttons for accessibility, above the table */}
      <div className="flex flex-wrap gap-2 items-center justify-end mb-2">
        <ExportButton
          tableType="persons"
          title={`Reporte de Análisis - ${viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}`}
          sorting={{ field: currentSort.field, direction: currentSort.order }}
          columns={['identification', 'firstName', 'lastName', 'birthDate', 'email', 'phone']}
          limit={1000}
          searchTerm={paginationParams.search}
          viewMode={viewMode}
          analyticsFilters={filterParams}
        >
          Exportar PDF
        </ExportButton>
        <AnalyticsExportDialog
          tableType="persons"
          title={`Reporte de Análisis - ${viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}`}
          sorting={{ field: currentSort.field, direction: currentSort.order }}
          searchTerm={paginationParams.search}
          viewMode={viewMode}
          analyticsFilters={filterParams}
          currentData={currentData}
          totalCount={currentCount}
        />
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'initial' | 'filtered')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="initial" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Todos los datos
              </TabsTrigger>
              <TabsTrigger value="filtered" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Vista filtrada
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Filter Panel (only show in filtered mode) */}
      {viewMode === 'filtered' && (
        <FilterPanel
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          neighborhoods={neighborhoods}
          requirements={requirements}
          loading={optionsLoading}
        />
      )}

      {/* Summary Statistics */}
      {currentSummary && (
        <SummaryStats summary={currentSummary} />
      )}

      {/* Data Table */}
      <DataTable
        data={currentData}
        loading={currentLoading}
        error={currentError}
        onSort={handleSort}
        onSearch={handleSearch}
        onViewDetails={handleViewDetails}
        onExport={handleExport}
        currentSort={currentSort}
        searchTerm={paginationParams.search || ''}
        analyticsFilters={viewMode === 'filtered' ? filterParams : {}}
        viewMode={viewMode}
      />

      {/* Pagination */}
      {currentCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={currentCount}
          pageSize={paginationParams.limit || 20}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          disabled={currentLoading}
        />
      )}
    </div>
  );
}; 