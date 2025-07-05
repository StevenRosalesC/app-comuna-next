// Utility to map analytics filters to export filters for PDF export

import { ExportFilters } from '@/services/export';

export function mapAnalyticsFiltersToExportFilters(analyticsFilters: any): ExportFilters[] {
  const exportFilters: ExportFilters[] = [];

  if (!analyticsFilters) return exportFilters;

  // Edad mínima y máxima
  if (analyticsFilters.ageFilter?.minAge) {
    exportFilters.push({
      field: 'age',
      operator: 'gte', // No soportado por backend, pero ejemplo
      value: analyticsFilters.ageFilter.minAge
    });
  }
  if (analyticsFilters.ageFilter?.maxAge) {
    exportFilters.push({
      field: 'age',
      operator: 'lte', // No soportado por backend, pero ejemplo
      value: analyticsFilters.ageFilter.maxAge
    });
  }

  // Género
  if (analyticsFilters.gender) {
    exportFilters.push({
      field: 'gender',
      operator: 'equals',
      value: analyticsFilters.gender
    });
  }

  // Barrio
  if (analyticsFilters.membershipFilter?.neighborhoodId) {
    exportFilters.push({
      field: 'neighborhoodId',
      operator: 'equals',
      value: analyticsFilters.membershipFilter.neighborhoodId
    });
  }

  // Estado de membresía
  if (analyticsFilters.membershipFilter?.status && analyticsFilters.membershipFilter.status !== 'all') {
    exportFilters.push({
      field: 'memberStatus',
      operator: 'equals',
      value: analyticsFilters.membershipFilter.status === 'active' ? 'ACTIVE' : 'INACTIVE'
    });
  }

  // Discapacidad
  if (analyticsFilters.disabilityFilter?.hasDisability) {
    exportFilters.push({
      field: 'hasDisability',
      operator: 'equals',
      value: true
    });
  }
  if (analyticsFilters.disabilityFilter?.minPercentage) {
    exportFilters.push({
      field: 'disabilityPercentage',
      operator: 'gte',
      value: analyticsFilters.disabilityFilter.minPercentage
    });
  }
  if (analyticsFilters.disabilityFilter?.maxPercentage) {
    exportFilters.push({
      field: 'disabilityPercentage',
      operator: 'lte',
      value: analyticsFilters.disabilityFilter.maxPercentage
    });
  }

  // Estado de cuota
  if (analyticsFilters.financialFilter?.feeStatus && analyticsFilters.financialFilter.feeStatus !== 'ALL') {
    exportFilters.push({
      field: 'feeStatus',
      operator: 'equals',
      value: analyticsFilters.financialFilter.feeStatus
    });
  }
  // Monto mínimo/máximo
  if (analyticsFilters.financialFilter?.minAmountDue) {
    exportFilters.push({
      field: 'amountDue',
      operator: 'gte',
      value: analyticsFilters.financialFilter.minAmountDue
    });
  }
  if (analyticsFilters.financialFilter?.maxAmountDue) {
    exportFilters.push({
      field: 'amountDue',
      operator: 'lte',
      value: analyticsFilters.financialFilter.maxAmountDue
    });
  }
  // Año
  if (analyticsFilters.financialFilter?.year) {
    exportFilters.push({
      field: 'year',
      operator: 'equals',
      value: analyticsFilters.financialFilter.year
    });
  }

  // Requisitos aprobados
  if (analyticsFilters.requirementsFilter?.allApproved) {
    exportFilters.push({
      field: 'allRequirementsApproved',
      operator: 'equals',
      value: true
    });
  }

  return exportFilters;
} 