// Utility to map analytics filters to flat query params for PDF export

export function mapAnalyticsFiltersToQueryParams(analyticsFilters: any, searchTerm?: string): Record<string, any> {
  const params: Record<string, any> = {};

  if (!analyticsFilters) return params;

  // Age filters
  if (analyticsFilters.ageFilter?.minAge) {
    params.minAge = analyticsFilters.ageFilter.minAge;
  }
  if (analyticsFilters.ageFilter?.maxAge) {
    params.maxAge = analyticsFilters.ageFilter.maxAge;
  }

  // Gender
  if (analyticsFilters.gender) {
    params.gender = analyticsFilters.gender;
  }

  // Neighborhood
  if (analyticsFilters.membershipFilter?.neighborhoodId) {
    params.neighborhoodId = analyticsFilters.membershipFilter.neighborhoodId;
  }
  if (analyticsFilters.membershipFilter?.neighborhoodName) {
    params.neighborhoodName = analyticsFilters.membershipFilter.neighborhoodName;
  }

  // Membership status
  if (analyticsFilters.membershipFilter?.status && analyticsFilters.membershipFilter.status !== 'all') {
    params.membershipStatus = analyticsFilters.membershipFilter.status;
  }

  // Disability
  if (analyticsFilters.disabilityFilter?.hasDisability) {
    params.hasDisability = analyticsFilters.disabilityFilter.hasDisability;
  }
  if (analyticsFilters.disabilityFilter?.minPercentage) {
    params.minDisabilityPercentage = analyticsFilters.disabilityFilter.minPercentage;
  }
  if (analyticsFilters.disabilityFilter?.maxPercentage) {
    params.maxDisabilityPercentage = analyticsFilters.disabilityFilter.maxPercentage;
  }

  // Financial filters
  if (analyticsFilters.financialFilter?.feeStatus && analyticsFilters.financialFilter.feeStatus !== 'ALL') {
    params.feeStatus = analyticsFilters.financialFilter.feeStatus;
  }
  if (analyticsFilters.financialFilter?.minAmountDue) {
    params.minAmountDue = analyticsFilters.financialFilter.minAmountDue;
  }
  if (analyticsFilters.financialFilter?.maxAmountDue) {
    params.maxAmountDue = analyticsFilters.financialFilter.maxAmountDue;
  }
  if (analyticsFilters.financialFilter?.year) {
    params.feeYear = analyticsFilters.financialFilter.year;
  }

  // Requirements
  if (analyticsFilters.requirementsFilter?.allApproved) {
    params.allRequirementsApproved = analyticsFilters.requirementsFilter.allApproved;
  }

  // Search term
  if (searchTerm) {
    params.search = searchTerm;
  }

  return params;
} 