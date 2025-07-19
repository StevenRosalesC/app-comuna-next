export const transformParamsForExport = (params: any) => {
  const flat: Record<string, any> = {};
  if (params.ageFilter) {
    if (params.ageFilter.minAge) flat.minAge = params.ageFilter.minAge;
    if (params.ageFilter.maxAge) flat.maxAge = params.ageFilter.maxAge;
  }
  if (params.gender) flat.gender = params.gender;
  if (params.membershipFilter) {
    if (params.membershipFilter.status) flat.membershipStatus = params.membershipFilter.status;
    if (params.membershipFilter.neighborhoodId) flat.neighborhoodId = params.membershipFilter.neighborhoodId;
    if (params.membershipFilter.neighborhoodName) flat.neighborhoodName = params.membershipFilter.neighborhoodName;
  }
  if (params.requirementsFilter) {
    if (params.requirementsFilter.allApproved) flat.allRequirementsApproved = params.requirementsFilter.allApproved;
  }
  if (params.disabilityFilter) {
    if (params.disabilityFilter.hasDisability) flat.hasDisability = params.disabilityFilter.hasDisability;
    if (params.disabilityFilter.minPercentage) flat.minDisabilityPercentage = params.disabilityFilter.minPercentage;
    if (params.disabilityFilter.maxPercentage) flat.maxDisabilityPercentage = params.disabilityFilter.maxPercentage;
  }
  if (params.financialFilter) {
    if (params.financialFilter.feeStatus) flat.feeStatus = params.financialFilter.feeStatus;
    if (params.financialFilter.minAmountDue) flat.minAmountDue = params.financialFilter.minAmountDue;
    if (params.financialFilter.maxAmountDue) flat.maxAmountDue = params.financialFilter.maxAmountDue;
    if (params.financialFilter.year) flat.feeYear = params.financialFilter.year;
  }
  return flat;
};