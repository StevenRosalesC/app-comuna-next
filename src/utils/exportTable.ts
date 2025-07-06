import { exportToPDF, exportToExcel } from '@/utils/exportUtils';

export async function exportTable({
  type,
  params,
  onSuccess,
  onError,
}: {
  type: 'pdf' | 'excel' | 'csv';
  params: any;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) {
  try {
    if (type === 'pdf') {
      const result = await exportToPDF(params);
      if (result.success) onSuccess?.();
      else onError?.(result.error);
    } else if (type === 'excel') {
      await exportToExcel(params);
      onSuccess?.();
    } else if (type === 'csv') {
      // Future: implement CSV export logic here
      onSuccess?.();
    }
  } catch (err) {
    onError?.(err);
  }
} 