import apiCommunity from '@/utils/communityApi';
import { ServiceResponse } from '../interfaces/common';

export type ExportOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'gte' | 'lte';

export interface ExportFilters {
  field: string;
  operator: ExportOperator;
  value: string | number | boolean;
}

export interface ExportSorting {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ExportParams {
  tableType: string;
  title?: string;
  filters?: ExportFilters[];
  sorting?: ExportSorting;
  columns?: string[];
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export const exportService = {
  // Export table data to PDF
  async exportTableToPDF(params: ExportParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams({
        tableType: params.tableType,
        ...(params.title && { title: params.title }),
        ...(params.filters && { filters: JSON.stringify(params.filters) }),
        ...(params.sorting && { sorting: JSON.stringify(params.sorting) }),
        ...(params.columns && { columns: JSON.stringify(params.columns) }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.dateFrom && { dateFrom: params.dateFrom }),
        ...(params.dateTo && { dateTo: params.dateTo }),
      });

      const response = await apiCommunity.get(`/reports/table-export?${queryParams}`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download PDF file
  downloadPDF(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Generate filename with timestamp
  generateFilename(tableType: string, title?: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const baseName = title || `reporte-${tableType}`;
    return `${baseName}-${timestamp}.pdf`;
  }
}; 