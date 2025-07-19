import { exportService, ExportParams } from '@/services/export';
import apiCommunity from './communityApi';

// Utilidad para exportar a Excel
export async function exportToExcel(params: any) {
  try {
    const blob = await exportService.exportTableToExcel(params);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${params.title || 'reporte'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw error;
  }
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