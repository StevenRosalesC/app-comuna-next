import {
  Collection,
  Contribution,
  CreateCollectionDto,
  UpdateCollectionDto,
  PayContributionDto,
  CreateExternalContributionDto,
  CloseCollectionDto,
  GetCollectionsParams,
  GetContributionsParams,
  PaginatedCollectionsResponse,
  PaginatedContributionsResponse
} from '@/interfaces/collections';
import apiCommunity from '@/utils/communityApi';

class CollectionsService {
  /**
   * Get all collections with filters
   */
  async getCollections(
    params: GetCollectionsParams = {}
  ): Promise<PaginatedCollectionsResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', String(params.limit));
    if (params.offset !== undefined) queryParams.append('offset', String(params.offset));
    if (params.search) queryParams.append('search', params.search);
    if (params.collectionStatus && params.collectionStatus !== 'ALL') {
      queryParams.append('collectionStatus', params.collectionStatus);
    }
    if (params.reasonType && params.reasonType !== 'ALL') {
      queryParams.append('reasonType', params.reasonType);
    }

    const { data } = await apiCommunity.get<any>(
      `/collections?${queryParams.toString()}`
    );

    // Support both direct array and { data: [], count: number } response structures
    if (Array.isArray(data)) {
      return { data, count: data.length };
    }
    return {
      data: data?.data || data?.collections || [],
      count: data?.count ?? (data?.data || []).length
    };
  }

  /**
   * Get a single collection by ID including its calculated financial summary
   */
  async getCollectionById(id: string): Promise<Collection> {
    const { data } = await apiCommunity.get<Collection>(`/collections/${id}`);
    return data;
  }

  /**
   * Create a new collection
   */
  async createCollection(dto: CreateCollectionDto): Promise<Collection> {
    const { data } = await apiCommunity.post<Collection>('/collections', dto);
    return data;
  }

  /**
   * Update collection details
   */
  async updateCollection(
    id: string,
    dto: UpdateCollectionDto
  ): Promise<Collection> {
    const { data } = await apiCommunity.patch<Collection>(
      `/collections/${id}`,
      dto
    );
    return data;
  }

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<any> {
    const { data } = await apiCommunity.delete(`/collections/${id}`);
    return data;
  }

  /**
   * Get contributions for a specific collection (Live table / altavoz)
   */
  async getContributions(
    collectionId: string,
    params: GetContributionsParams = {}
  ): Promise<PaginatedContributionsResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', String(params.limit));
    if (params.offset !== undefined) queryParams.append('offset', String(params.offset));
    if (params.search) queryParams.append('search', params.search);
    if (params.neighborhoodId && params.neighborhoodId !== 'ALL') {
      queryParams.append('neighborhoodId', params.neighborhoodId);
    }
    if (params.contributionStatus && params.contributionStatus !== 'ALL') {
      queryParams.append('contributionStatus', params.contributionStatus);
    }
    if (params.isExternal !== undefined) {
      queryParams.append('isExternal', String(params.isExternal));
    }

    const { data } = await apiCommunity.get<any>(
      `/collections/${collectionId}/contributions?${queryParams.toString()}`
    );

    if (Array.isArray(data)) {
      return { data, count: data.length };
    }
    return {
      data: data?.data || data?.contributions || [],
      count: data?.count ?? (data?.data || []).length
    };
  }

  /**
   * Register a payment for a comunero contribution (Option A - by contribution UUID)
   */
  async payContribution(
    contributionId: string,
    dto: PayContributionDto
  ): Promise<Contribution> {
    const { data } = await apiCommunity.patch<Contribution>(
      `/collections/contributions/${contributionId}/pay`,
      dto
    );
    return data;
  }

  /**
   * Register a payment directly by collectionId and memberId (Option B - Upsert)
   * Recommended for direct member collection and newly created members
   */
  async payContributionByMember(
    collectionId: string,
    memberId: string | number,
    dto: PayContributionDto
  ): Promise<Contribution> {
    const { data } = await apiCommunity.patch<Contribution>(
      `/collections/${collectionId}/members/${memberId}/pay`,
      dto
    );
    return data;
  }

  /**
   * Mark a contribution as publicly announced via loudspeaker
   */
  async announceContribution(contributionId: string): Promise<Contribution> {
    const { data } = await apiCommunity.patch<Contribution>(
      `/collections/contributions/${contributionId}/announce`,
      {}
    );
    return data;
  }

  /**
   * Register an external voluntary donor contribution
   */
  async createExternalContribution(
    collectionId: string,
    dto: CreateExternalContributionDto
  ): Promise<Contribution> {
    const { data } = await apiCommunity.post<Contribution>(
      `/collections/${collectionId}/contributions/external`,
      dto
    );
    return data;
  }

  /**
   * Close and liquidate collection, sending retention to destination fund
   */
  async closeCollection(
    collectionId: string,
    dto: CloseCollectionDto
  ): Promise<Collection> {
    const { data } = await apiCommunity.patch<Collection>(
      `/collections/${collectionId}/close`,
      dto
    );
    return data;
  }
}

export const collectionsService = new CollectionsService();
