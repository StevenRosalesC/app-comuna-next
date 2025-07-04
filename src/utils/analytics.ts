// Utility functions for analytics module

export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getDisabilityLevel = (percentage: number): string => {
  if (percentage >= 75) return 'Very High';
  if (percentage >= 50) return 'High';
  if (percentage >= 25) return 'Medium';
  return 'Low';
};

export const getDisabilityColor = (percentage: number): string => {
  if (percentage >= 75) return 'bg-red-100 text-red-800';
  if (percentage >= 50) return 'bg-orange-100 text-orange-800';
  if (percentage >= 25) return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800';
};

export const exportToCSV = (data: any[], filename: string = 'analytics-data.csv') => {
  if (data.length === 0) return;

  // Define headers based on the first record
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], filename: string = 'analytics-data.xlsx') => {
  // This would require a library like xlsx
  // For now, we'll use CSV as a fallback
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
};

export const generateReport = (data: any[], summary: any) => {
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    totalRecords: data.length,
    data: data.slice(0, 100) // Limit to first 100 records for report
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { 
    type: 'application/json;charset=utf-8;' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 