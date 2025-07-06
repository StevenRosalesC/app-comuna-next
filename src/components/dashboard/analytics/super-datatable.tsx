'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Database, Filter, RotateCcw } from 'lucide-react';
import { useInitialAnalytics, useAnalytics, useFilterOptions } from '@/hooks/useAnalytics';
import { AnalyticsQuery, PaginationParams } from '@/services/analytics';
import { SummaryStats } from './summary-stats';
import { FilterPanel } from './filter-panel';
import { DataTable } from './data-table';
import { Pagination } from './pagination';
import { AnalyticsExportDialog } from './analytics-export-dialog';
import { ExportNameDialog } from './export-name-dialog';
import { useExport } from '@/hooks/useExport';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';

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

// Utility to build flat filters ONLY for Excel export
// This function maps the current table state to the allowed backend query params
// according to the export documentation. No nested objects or extra fields.
type ExcelExportFiltersArgs = {
  reportName: string;
  paginationParams: any;
  filterParams: any;
  currentSort: { field: string; order: 'asc' | 'desc' };
  columns?: string[];
  customColumns?: string[];
  limit?: number;
};

function buildExcelExportFilters({
  reportName,
  paginationParams,
  filterParams,
  currentSort,
  columns = [
    'identification',
    'firstName',
    'lastName',
    'birthDate',
    'email',
    'phone',
  ],
  customColumns = [],
  limit = 1000,
}: ExcelExportFiltersArgs) {
  // Build the flat filters object for Excel export
  const filters: Record<string, any> = {
    search: paginationParams.search,
    orderBy: currentSort.field,
    order: currentSort.order,
    limit,
    columns,
    customColumns,
  };

  // Demographic filters
  if (filterParams.ageFilter?.minAge) filters.minAge = filterParams.ageFilter.minAge;
  if (filterParams.ageFilter?.maxAge) filters.maxAge = filterParams.ageFilter.maxAge;
  if (filterParams.gender) filters.gender = filterParams.gender;
  if (filterParams.membershipFilter?.neighborhoodId) filters.neighborhoodId = filterParams.membershipFilter.neighborhoodId;
  if (filterParams.membershipFilter?.neighborhoodName) filters.neighborhoodName = filterParams.membershipFilter.neighborhoodName;

  // Membership filters
  if (filterParams.membershipFilter?.status) filters.membershipStatus = filterParams.membershipFilter.status;
  if (filterParams.requirementsFilter?.allApproved) filters.allRequirementsApproved = filterParams.requirementsFilter.allApproved;

  // Disability filters
  if (filterParams.disabilityFilter?.hasDisability) filters.hasDisability = filterParams.disabilityFilter.hasDisability;
  if (filterParams.disabilityFilter?.minPercentage) filters.minDisabilityPercentage = filterParams.disabilityFilter.minPercentage;
  if (filterParams.disabilityFilter?.maxPercentage) filters.maxDisabilityPercentage = filterParams.disabilityFilter.maxPercentage;

  // Financial filters
  if (filterParams.financialFilter?.feeStatus) filters.feeStatus = filterParams.financialFilter.feeStatus;
  if (filterParams.financialFilter?.minAmountDue) filters.minAmountDue = filterParams.financialFilter.minAmountDue;
  if (filterParams.financialFilter?.maxAmountDue) filters.maxAmountDue = filterParams.financialFilter.maxAmountDue;
  if (filterParams.financialFilter?.year) filters.feeYear = filterParams.financialFilter.year;

  return filters;
}

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

  // Add controlled filter state for FilterPanel
  const [filterPanelState, setFilterPanelState] = useState<AnalyticsQuery>({});

  // State for immediate search input (for UI responsiveness)
  const [searchInput, setSearchInput] = useState('');

  // Debounced search value for API calls (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);

  // Get filter options
  const { neighborhoods, requirements, loading: optionsLoading } = useFilterOptions();

  // Export hook
  const { exportToPDF } = useExport();

  // Always call both hooks, select the correct result
  const initialQuery = useInitialAnalytics(paginationParams);
  const filteredQuery = useAnalytics(filterParams);
  const currentQuery = viewMode === 'filtered' ? filteredQuery : initialQuery;
  const currentData = currentQuery.data;
  const currentSummary = currentQuery.summary;
  const currentLoading = currentQuery.isFetching;
  const currentError = currentQuery.error;
  const currentCount = currentQuery.totalCount;
  const refetchAnalytics = currentQuery.refetch;

  // Calculate current page and total pages
  const currentPage = Math.floor((paginationParams.offset || 0) / (paginationParams.limit || 20)) + 1;
  const totalPages = Math.ceil(currentCount / (paginationParams.limit || 20));

  // Handle search input change (immediate UI update)
  const handleSearchInput = (searchTerm: string) => {
    setSearchInput(searchTerm);
  };

  // Handle debounced search (for API calls)
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
    setFilterParams(filters);
    setViewMode('filtered');
    setPaginationParams(prev => ({
      ...prev,
      offset: 0
    }));
  };

  // When filters are changed in the panel (but not yet applied)
  const handlePanelChange = (filters: AnalyticsQuery) => {
    setFilterPanelState(filters);
  };

  // Handle filter clearing
  const handleClearFilters = () => {
    setFilterParams({});
    setFilterPanelState({});
    setViewMode('initial');
    setSearchInput('');
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

  // Handles export for both PDF and Excel. PDF logic is legacy and should not be changed.
  const handleExport = async (reportName: string, type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      // PDF export: do not change this logic
      (exportToPDF as any)({
        tableType: 'persons',
        title: reportName,
        filters: [], // or your PDF filter logic
        sorting: {
          field: currentSort.field,
          direction: currentSort.order,
        },
        columns: [
          'identification',
          'firstName',
          'lastName',
          'birthDate',
          'email',
          'phone',
        ],
        limit: 1000,
      });
    } else {
      // Excel export: use only flat filters as per documentation
      const exportFilters = buildExcelExportFilters({
        reportName,
        paginationParams,
        filterParams,
        currentSort,
      });
      let toastId: string | number | undefined;
      try {
        toastId = toast.loading('Generating Excel file...');
        await exportToExcel(exportFilters);
        toast.success('Excel file downloaded successfully', { id: toastId });
      } catch (error: any) {
        toast.error(`Export error: ${error.message || error}`, { id: toastId });
      }
    }
  };

  // Update current sort when pagination params change
  useEffect(() => {
    setCurrentSort({
      field: paginationParams.orderBy || 'lastName',
      order: (paginationParams.order as 'asc' | 'desc') || 'asc'
    });
  }, [paginationParams.orderBy, paginationParams.order]);

  // Sync debounced search with pagination params
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  // Synchronize quick actions with filters and panel
  const handleQuickAction = (filters: AnalyticsQuery) => {
    setFilterParams(filters);
    setFilterPanelState(filters);
    setViewMode('filtered');
    setPaginationParams(prev => ({
      ...prev,
      offset: 0
    }));
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL with filters and pagination
  const updateUrlParams = (filters: AnalyticsQuery, pagination: PaginationParams) => {
    const params = new URLSearchParams();
    // Add filters
    if (filters.ageFilter?.minAge) params.set('minAge', String(filters.ageFilter.minAge));
    if (filters.ageFilter?.maxAge) params.set('maxAge', String(filters.ageFilter.maxAge));
    if (filters.gender) params.set('gender', String(filters.gender));
    if (filters.membershipFilter?.status) params.set('membershipStatus', filters.membershipFilter.status);
    if (filters.membershipFilter?.neighborhoodId) params.set('neighborhoodId', filters.membershipFilter.neighborhoodId);
    if (filters.disabilityFilter?.hasDisability) params.set('hasDisability', 'true');
    if (filters.disabilityFilter?.minPercentage) params.set('minDisabilityPercentage', String(filters.disabilityFilter.minPercentage));
    if (filters.financialFilter?.feeStatus) params.set('feeStatus', filters.financialFilter.feeStatus);
    if (filters.financialFilter?.minAmountDue) params.set('minAmountDue', String(filters.financialFilter.minAmountDue));
    if (filters.financialFilter?.year) params.set('feeYear', String(filters.financialFilter.year));
    if (filters.requirementsFilter?.allApproved) params.set('allRequirementsApproved', 'true');
    // Add pagination
    if (pagination.limit) params.set('limit', String(pagination.limit));
    if (pagination.offset) params.set('offset', String(pagination.offset));
    if (pagination.search) params.set('search', pagination.search);
    if (pagination.orderBy) params.set('orderBy', pagination.orderBy);
    if (pagination.order) params.set('order', pagination.order);
    router.replace(`?${params.toString()}`);
  };

  // On mount, restore filters and pagination from URL
  useEffect(() => {
    const params = searchParams;
    const restoredFilters: AnalyticsQuery = {};
    const restoredPagination: PaginationParams = {
      limit: params.get('limit') ? Number(params.get('limit')) : 20,
      offset: params.get('offset') ? Number(params.get('offset')) : 0,
      search: params.get('search') || '',
      orderBy: params.get('orderBy') || 'lastName',
      order: (params.get('order') as 'asc' | 'desc') || 'asc',
    };
    if (params.get('minAge')) restoredFilters.ageFilter = { minAge: Number(params.get('minAge')) };
    if (params.get('maxAge')) restoredFilters.ageFilter = { ...(restoredFilters.ageFilter || {}), maxAge: Number(params.get('maxAge')) };
    if (params.get('gender')) {
      const g = Number(params.get('gender'));
      if (g === 1 || g === 2) restoredFilters.gender = g;
    }
    if (params.get('membershipStatus')) {
      const status = params.get('membershipStatus');
      if (status === 'active' || status === 'inactive' || status === 'all') {
        restoredFilters.membershipFilter = { ...(restoredFilters.membershipFilter || {}), status };
      }
    }
    if (params.get('neighborhoodId')) restoredFilters.membershipFilter = { ...(restoredFilters.membershipFilter || {}), neighborhoodId: params.get('neighborhoodId')! };
    if (params.get('hasDisability')) restoredFilters.disabilityFilter = { hasDisability: true };
    if (params.get('minDisabilityPercentage')) restoredFilters.disabilityFilter = { ...(restoredFilters.disabilityFilter || {}), minPercentage: Number(params.get('minDisabilityPercentage')) };
    if (params.get('feeStatus')) {
      const feeStatus = params.get('feeStatus');
      if (feeStatus === 'PENDING' || feeStatus === 'PAID' || feeStatus === 'PARTIAL') {
        restoredFilters.financialFilter = { ...(restoredFilters.financialFilter || {}), feeStatus };
      }
    }
    if (params.get('minAmountDue')) restoredFilters.financialFilter = { ...(restoredFilters.financialFilter || {}), minAmountDue: Number(params.get('minAmountDue')) };
    if (params.get('feeYear')) restoredFilters.financialFilter = { ...(restoredFilters.financialFilter || {}), year: Number(params.get('feeYear')) };
    if (params.get('allRequirementsApproved')) restoredFilters.requirementsFilter = { allApproved: true };
    setFilterParams(restoredFilters);
    setFilterPanelState(restoredFilters);
    setPaginationParams(restoredPagination);
    setSearchInput(restoredPagination.search || '');
    if (Object.keys(restoredFilters).length > 0) setViewMode('filtered');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when filters or pagination change
  useEffect(() => {
    updateUrlParams(filterParams, paginationParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams, paginationParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de personas</h1>
          <p className="text-muted-foreground">Comuna Bambil Collao</p>
          <span className="text-muted-foreground">En esta seccion podras ver la lista de personas de la comuna, filtrarlos y exportarlos a PDF  </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            {currentCount.toLocaleString()} Registros totales
          </Badge>
        </div>
      </div>

      {/* Summary Statistics */}
      {currentSummary && (
        <SummaryStats summary={currentSummary} />
      )}

      {/* Export buttons and reload button for accessibility, above the table */}
      <div className="flex flex-wrap gap-2 items-center justify-end mb-2">
        <ExportNameDialog
          onExport={handleExport}
          defaultTitle={`Reporte de Análisis - ${viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}`}
          type="pdf"
        >
          <Button variant="default" size="sm">
            Exportar PDF
          </Button>
        </ExportNameDialog>
        <ExportNameDialog
          onExport={handleExport}
          defaultTitle={`Reporte de Análisis - ${viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}`}
          type="excel"
        >
          <Button variant="secondary" size="sm">
            Exportar Excel
          </Button>
        </ExportNameDialog>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchAnalytics()}
          title="Recargar datos"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Recargar
        </Button>
      </div>
      <QuickActions onSelect={handleQuickAction} />

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
          value={filterPanelState}
          onChange={handlePanelChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          neighborhoods={neighborhoods}
          requirements={requirements}
          loading={optionsLoading}
        />
      )}

      {/* Data Table */}
      <DataTable
        data={currentData}
        loading={currentLoading}
        error={currentError}
        onSort={handleSort}
        onSearch={handleSearchInput}
        onViewDetails={handleViewDetails}
        currentSort={currentSort}
        searchTerm={searchInput}
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