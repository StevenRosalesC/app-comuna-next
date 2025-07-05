'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { ExportParams } from '@/services/export';
import { toast } from 'sonner';
import { mapAnalyticsFiltersToExportFilters } from './export-utils';

interface ExportButtonProps {
  tableType: string;
  title?: string;
  filters?: any[];
  sorting?: { field: string; direction: 'asc' | 'desc' };
  columns?: string[];
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
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
}

export const ExportButton = ({
  tableType,
  title,
  filters = [],
  sorting,
  columns = [],
  limit = 1000,
  dateFrom,
  dateTo,
  variant = 'outline',
  size = 'sm',
  className = '',
  children,
  searchTerm,
  viewMode,
  analyticsFilters,
  onExportSuccess
}: ExportButtonProps) => {
  const { exportToPDF, loading, error } = useExport();

  const handleExport = async () => {
    // Convert analytics filters to export format if provided
    let exportFilters = [...filters];

    if (viewMode === 'filtered' && analyticsFilters) {
      exportFilters = exportFilters.concat(mapAnalyticsFiltersToExportFilters(analyticsFilters));
    }

    if (searchTerm) {
      exportFilters.push({
        field: 'firstName',
        operator: 'contains' as const,
        value: searchTerm
      });
    }

    // Log para depuración
    console.log('[ExportButton] exportFilters:', exportFilters);
    console.log('[ExportButton] analyticsFilters:', analyticsFilters);
    console.log('[ExportButton] viewMode:', viewMode);

    const params: ExportParams = {
      tableType,
      title,
      filters: exportFilters,
      sorting,
      columns,
      limit,
      dateFrom,
      dateTo,
    };

    const result = await exportToPDF(params);

    if (result.success) {
      toast.success('Archivo exportado correctamente');
      onExportSuccess?.();
    } else {
      toast.error(result.error || 'Error al exportar el archivo');
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
      {children || 'Exportar PDF'}
    </Button>
  );
}; 