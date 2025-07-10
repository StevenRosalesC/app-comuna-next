import apiCommunity from '@/utils/communityApi';

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
  queryParams?: Record<string, any>;
  sorting?: ExportSorting;
  columns?: string[];
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export const exportService = {
  // Export table data to PDF using flat query params 
  async exportTableToPDF(params: ExportParams): Promise<Blob> {
    try {
      const query: Record<string, any> = {
        ...(params.title && { title: params.title }),
        ...(params.limit && { limit: params.limit }),
        ...(params.orderBy && { orderBy: params.orderBy }),
        ...(params.order && { order: params.order }),
        ...(params.columns && params.columns.length > 0 && { columns: JSON.stringify(params.columns) }),
        ...params.queryParams,
      };
      const queryParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const response = await apiCommunity.get(`/reports/table-export?${queryParams.toString()}`, {
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