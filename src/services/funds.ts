import {
  Fund,
  FundMovement,
  CreateFundDto,
  UpdateFundDto,
  CreateFundMovementDto,
  GetFundMovementsParams,
  PaginatedFundsResponse,
  PaginatedFundMovementsResponse
} from '@/interfaces/funds';
import apiCommunity from '@/utils/communityApi';

class FundsService {
  /**
   * Get list of all community funds with balances
   */
  async getFunds(): Promise<Fund[]> {
    const { data } = await apiCommunity.get<any>('/funds');
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data || data?.funds || [];
  }

  /**
   * Get fund details by ID
   */
  async getFundById(id: string): Promise<Fund> {
    const { data } = await apiCommunity.get<Fund>(`/funds/${id}`);
    return data;
  }

  /**
   * Create a new community fund
   */
  async createFund(dto: CreateFundDto): Promise<Fund> {
    const { data } = await apiCommunity.post<Fund>('/funds', dto);
    return data;
  }

  /**
   * Update fund details
   */
  async updateFund(id: string, dto: UpdateFundDto): Promise<Fund> {
    const { data } = await apiCommunity.patch<Fund>(`/funds/${id}`, dto);
    return data;
  }

  /**
   * Get movements (Kardex) for a specific fund
   */
  async getFundMovements(
    fundId: string,
    params: GetFundMovementsParams = {}
  ): Promise<PaginatedFundMovementsResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', String(params.limit));
    if (params.offset !== undefined) queryParams.append('offset', String(params.offset));
    if (params.type && params.type !== 'ALL') queryParams.append('type', params.type);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.search) queryParams.append('search', params.search);

    const { data } = await apiCommunity.get<any>(
      `/funds/${fundId}/movements?${queryParams.toString()}`
    );

    if (Array.isArray(data)) {
      return { data, count: data.length };
    }
    return {
      data: data?.data || data?.movements || [],
      count: data?.count ?? (data?.data || []).length
    };
  }

  /**
   * Register a manual income or expense movement in a fund
   */
  async createFundMovement(
    fundId: string,
    dto: CreateFundMovementDto
  ): Promise<FundMovement> {
    const { data } = await apiCommunity.post<FundMovement>(
      `/funds/${fundId}/movements`,
      dto
    );
    return data;
  }
}

export const fundsService = new FundsService();
