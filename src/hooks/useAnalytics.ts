import { useState, useEffect } from 'react';
import { analyticsService, AnalyticsQuery, PaginationParams } from '@/services/analytics';
import { neighborhoodsService } from '@/services/neighborhoods';

// Hook for initial analytics data
export const useInitialAnalytics = (params: PaginationParams) => {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await analyticsService.getInitialData(params);
        
        if (response.data) {
          setData(response.data.data);
          setSummary(response.data.summary);
          setTotalCount(response.data.count);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return { data, summary, loading, error, totalCount };
};

// Hook for advanced analytics queries
export const useAnalytics = (query: AnalyticsQuery) => {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const executeQuery = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await analyticsService.executeQuery(query);
        
        if (response.data) {
          setData(response.data.data);
          setSummary(response.data.summary);
          setTotalCount(response.data.count);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    executeQuery();
  }, [query]);

  return { data, summary, loading, error, totalCount };
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