import { useState } from 'react';
import { exportService, ExportParams } from '@/services/export';

export const useExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = async (params: ExportParams) => {
    try {
      setLoading(true);
      setError(null);

      const blob = await exportService.exportTableToPDF(params);
      const filename = exportService.generateFilename(params.tableType, params.title);
      exportService.downloadPDF(blob, filename);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar el archivo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async (params: ExportParams) => {
    try {
      setLoading(true);
      setError(null);

      const blob = await exportService.exportTableToExcel(params);
      const filename = exportService.generateFilename(params.tableType, params.title).replace('.pdf', '.xlsx');
      exportService.downloadPDF(blob, filename);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar el archivo Excel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    exportToPDF,
    exportToExcel,
    loading,
    error,
    clearError,
  };
}; 