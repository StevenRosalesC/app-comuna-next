'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { ExportParams } from '@/services/export';
import { toast } from 'sonner';
import { mapAnalyticsFiltersToQueryParams } from './export-utils';

interface ExportButtonProps {
  tableType: string;
  title?: string;
  sorting?: { field: string; direction: 'asc' | 'desc' };
  columns?: string[];
  customColumns?: string[]; // Blank columns for signatures, observations, etc.
  orientation?: 'portrait' | 'landscape'; // Page orientation
  limit?: number;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  // Analytics specific props
  searchTerm?: string;
  viewMode?: 'initial' | 'filtered';
  analyticsFilters?: any;
  // Callback after successful export
  onExportSuccess?: () => void;
  exportType?: 'pdf' | 'excel';
}

export const ExportButton = ({
  tableType,
  title,
  sorting,
  columns = [],
  customColumns = [],
  orientation = 'portrait',
  limit = 1000,
  variant = 'outline',
  size = 'sm',
  className = '',
  children,
  searchTerm,
  viewMode,
  analyticsFilters,
  onExportSuccess,
  exportType = 'pdf',
}: ExportButtonProps) => {
  const { exportToPDF, loading, error } = useExport();
  // Import the Excel export utility
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { exportToExcel } = require('@/utils/exportUtils');
  if (error) {
    toast.error(error);
  }
  const handleExport = async () => {
    // Build flat query params from analytics filters
    const queryParams =
      viewMode === 'filtered' && analyticsFilters
        ? mapAnalyticsFiltersToQueryParams(analyticsFilters, searchTerm)
        : searchTerm
          ? { search: searchTerm }
          : {};

    // Sorting
    let orderBy: string | undefined = undefined;
    let order: 'asc' | 'desc' | undefined = undefined;
    if (sorting) {
      orderBy = sorting.field;
      order = sorting.direction;
    }

    // Always add columns, customColumns, and orientation to queryParams
    if (columns && columns.length > 0) {
      queryParams.columns = JSON.stringify(columns);
    }
    if (customColumns && customColumns.length > 0) {
      queryParams.customColumns = JSON.stringify(customColumns);
    }
    if (orientation) {
      queryParams.orientation = orientation;
    }

    const params: ExportParams = {
      tableType,
      title,
      queryParams,
      limit,
      orderBy,
      order,
    };

    if (exportType === 'excel') {
      try {
        toast.loading('Generando archivo Excel...');
        await exportToExcel(queryParams);
        toast.dismiss();
        toast.success('Archivo Excel descargado exitosamente');
        onExportSuccess?.();
      } catch (err: any) {
        toast.dismiss();
        toast.error(`Error al exportar: ${err.message || err}`);
      }
      return;
    }

    // Default: PDF
    const result = await exportToPDF(params);
    if (result.success) {
      toast.success('File exported successfully');
      onExportSuccess?.();
    } else {
      toast.error(result.error || 'Error exporting file');
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {children || (exportType === 'excel' ? 'Exportar Excel' : 'Exportar PDF')}
    </Button>
  );
}; 