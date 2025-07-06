import { exportService, ExportParams } from '@/services/export';
import apiCommunity from './communityApi';

// Utilidad para exportar a Excel
export async function exportToExcel(params: any) {
  // Only allow parameters accepted by the Excel export endpoint
  const allowedKeys = ['title', 'columns', 'limit'];
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (allowedKeys.includes(key) && value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const url = `reports/table-export-excel?${queryParams.toString()}`;

  const response = await apiCommunity.get(url, {
    responseType: 'blob',
  });

  const blob = response.data;
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${params.title || 'reporte'}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// Plain utility for PDF export (for centralization)
export async function exportToPDF(params: ExportParams) {
  try {
    const blob = await exportService.exportTableToPDF(params);
    const filename = exportService.generateFilename(params.tableType, params.title);
    exportService.downloadPDF(blob, filename);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Export error' };
  }
} 