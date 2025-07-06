import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService, AnalyticsQuery, PaginationParams } from '@/services/analytics';
import { neighborhoodsService } from '@/services/neighborhoods';

// Analytics response type
interface AnalyticsResponse {
  data: any[];
  summary: any;
  count: number;
}

// Hook for initial analytics data using TanStack Query
export const useInitialAnalytics = (params: PaginationParams) => {
  const queryKey = ['analytics-initial', params];
  const {
    data = { data: [], summary: null, count: 0 },
    isLoading: loading,
    error,
    isFetching,
    refetch,
  } = useQuery<AnalyticsResponse, Error>({
    queryKey,
    queryFn: async () => {
      const response = await analyticsService.getInitialData(params);
      return response.data;
    },
    placeholderData: { data: [], summary: null, count: 0 },
  });

  return {
    data: data.data,
    summary: data.summary,
    loading,
    error: error ? error.message : null,
    totalCount: data.count,
    isFetching,
    refetch,
  };
};

// Hook for advanced analytics queries using TanStack Query
export const useAnalytics = (query: AnalyticsQuery) => {
  const queryKey = ['analytics', query];
  const {
    data = { data: [], summary: null, count: 0 },
    isLoading: loading,
    error,
    isFetching,
    refetch,
  } = useQuery<AnalyticsResponse, Error>({
    queryKey,
    queryFn: async () => {
      const response = await analyticsService.executeQuery(query);
      return response.data;
    },
    placeholderData: { data: [], summary: null, count: 0 },
  });

  return {
    data: data.data,
    summary: data.summary,
    loading,
    error: error ? error.message : null,
    totalCount: data.count,
    isFetching,
    refetch,
  };
};

// Hook for filter options (neighborhoods, requirements)
export const useFilterOptions = () => {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const neighborhoodsResponse = await neighborhoodsService.getNeighborhoods({ limit: 1000 });
        setNeighborhoods(Array.isArray(neighborhoodsResponse.neighborhoods) ? neighborhoodsResponse.neighborhoods : []);

        const requirementsResponse = await analyticsService.getRequirements();
        setRequirements(requirementsResponse.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { neighborhoods, requirements, loading, error };
}; 