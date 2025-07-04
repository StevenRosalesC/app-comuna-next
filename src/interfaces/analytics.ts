// Analytics module interfaces

export interface AnalyticsQuery {
  ageFilter?: {
    minAge?: number;
    maxAge?: number;
  };
  gender?: 1 | 2; // 1 = Male, 2 = Female
  membershipFilter?: {
    status?: 'active' | 'inactive' | 'all';
    neighborhoodId?: string;
    neighborhoodName?: string;
  };
  disabilityFilter?: {
    hasDisability?: boolean;
    percentageRange?: 'none' | 'low' | 'medium' | 'high' | 'very_high';
    minPercentage?: number;
    maxPercentage?: number;
  };
  financialFilter?: {
    feeStatus?: 'PENDING' | 'PAID' | 'PARTIAL';
    minAmountDue?: number;
    maxAmountDue?: number;
    year?: number;
  };
  requirementsFilter?: {
    allApproved?: boolean;
    requirementIds?: string[];
  };
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface AnalyticsSummary {
  totalPersons: number;
  totalMembers: number;
  totalWithDisability: number;
  totalWithPendingFees: number;
  averageAge: number;
  membershipRate: string;
  disabilityRate: string;
}

export interface AnalyticsPerson {
  personId: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  phoneNumber: string;
  birthDate: Date;
  status: boolean;
  email: string;
  hasDisability: boolean;
  disabilityPercentage: number;
  neighborhood: {
    neighborhoodId: string;
    neighborhoodName: string;
  };
  members: AnalyticsMember[];
  personRequirement: AnalyticsPersonRequirement[];
  _count: {
    members: number;
    personRequirement: number;
  };
}

export interface AnalyticsMember {
  memberId: string;
  status: boolean;
  houseNumber: string;
  memberFees: AnalyticsMemberFee[];
}

export interface AnalyticsMemberFee {
  memberFeeId: string;
  status: 'PENDING' | 'PAID' | 'PARTIAL';
  amountDue: number;
  amountPaid: number;
  annualFee: {
    feeId: string;
    name: string;
    amount: number;
    year: number;
  };
}

export interface AnalyticsPersonRequirement {
  personRequirementId: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  observation: string;
  approvalDate: Date;
  requirement: {
    requirementId: string;
    requirement: string;
  };
  approvedByUser: {
    username: string;
    person: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AnalyticsResponse {
  data: AnalyticsPerson[];
  count: number;
  pagination?: PaginationParams;
  filters?: AnalyticsQuery;
  summary: AnalyticsSummary;
}

export interface FilterOption {
  neighborhoodId: string;
  neighborhoodName: string;
}

export interface RequirementOption {
  requirementId: string;
  requirement: string;
}

export interface ViewMode {
  mode: 'initial' | 'filtered';
}

export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  filename?: string;
  includeSummary?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  filters: AnalyticsQuery;
  icon?: string;
}

export interface AnalyticsState {
  viewMode: ViewMode['mode'];
  pagination: PaginationParams;
  filters: AnalyticsQuery;
  sort: SortConfig;
  data: AnalyticsPerson[];
  summary: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
} 