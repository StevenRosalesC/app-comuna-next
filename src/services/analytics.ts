import apiCommunity from '@/utils/communityApi';
import { ServiceResponse } from '../interfaces/common';

export interface AnalyticsQuery {
  ageFilter?: {
    minAge?: number;
    maxAge?: number;
  };
  gender?: 1 | 2;
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

export interface AnalyticsResponse {
  data: any[];
  count: number;
  pagination?: PaginationParams;
  filters?: AnalyticsQuery;
  summary: {
    totalPersons: number;
    totalMembers: number;
    totalWithDisability: number;
    totalWithPendingFees: number;
    averageAge: number;
    membershipRate: string;
    disabilityRate: string;
  };
}

export const analyticsService = {
  // Get initial data with basic pagination and search
  async getInitialData(params: PaginationParams): Promise<ServiceResponse<AnalyticsResponse>> {
    try {
      const { data } = await apiCommunity.get<AnalyticsResponse>('/analytics/all', {
        params
      });
      
      return {
        data,
        message: 'Analytics data retrieved successfully',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  // Execute advanced analytics query with filters
  async executeQuery(query: AnalyticsQuery): Promise<ServiceResponse<AnalyticsResponse>> {
    try {
      const { data } = await apiCommunity.post<AnalyticsResponse>('/analytics/query', query);
      
      return {
        data,
        message: 'Analytics query executed successfully',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  // Get neighborhoods for filter options
  async getNeighborhoods(): Promise<ServiceResponse<any[]>> {
    try {
      const { data } = await apiCommunity.get('/neighborhoods');
      
      return {
        data,
        message: 'Neighborhoods retrieved successfully',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  // Get requirements for filter options
  async getRequirements(): Promise<ServiceResponse<any[]>> {
    try {
      const { data } = await apiCommunity.get('/requirements');
      
      return {
        data,
        message: 'Requirements retrieved successfully',
        status: true
      };
    } catch (error) {
      throw error;
    }
  }
}; 