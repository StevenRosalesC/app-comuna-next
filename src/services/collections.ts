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

function normalizeCollection(c: any): Collection {
  if (!c) return c;
  const collectionId = c.collectionId || c.collection_id || c.id || '';
  const status = c.collectionStatus || c.collection_status || c.status || 'ACTIVE';
  const reasonType = c.reasonType || c.reason_type || 'OTHER';

  return {
    ...c,
    collectionId: String(collectionId),
    collectionStatus: status,
    reasonType,
    baseAmount: Number(c.baseAmount ?? c.base_amount ?? 5),
    fundRetentionPercentage: Number(c.fundRetentionPercentage ?? c.fund_retention_percentage ?? 10),
    summary: c.summary ? {
      totalExpected: Number(c.summary.totalExpected ?? c.summary.total_expected ?? 0),
      totalCollected: Number(c.summary.totalCollected ?? c.summary.total_collected ?? 0),
      retainedForFund: Number(c.summary.retainedForFund ?? c.summary.retained_for_fund ?? 0),
      netForBeneficiary: Number(c.summary.netForBeneficiary ?? c.summary.net_for_beneficiary ?? 0),
      countTotal: Number(c.summary.countTotal ?? c.summary.count_total ?? 0),
      countPending: Number(c.summary.countPending ?? c.summary.count_pending ?? 0),
      countPaid: Number(c.summary.countPaid ?? c.summary.count_paid ?? 0),
      countAnnounced: Number(c.summary.countAnnounced ?? c.summary.count_announced ?? 0)
    } : undefined
  };
}

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
      return { data: data.map(normalizeCollection), count: data.length };
    }
    const rawList = data?.data || data?.collections || [];
    return {
      data: rawList.map(normalizeCollection),
      count: data?.count ?? rawList.length
    };
  }

  /**
   * Get a single collection by ID including its calculated financial summary
   */
  async getCollectionById(id: string): Promise<Collection> {
    const { data } = await apiCommunity.get<any>(`/collections/${id}`);
    return normalizeCollection(data);
  }

  /**
   * Create a new collection
   */
  async createCollection(dto: CreateCollectionDto): Promise<Collection> {
    const { data } = await apiCommunity.post<any>('/collections', dto);
    return normalizeCollection(data);
  }

  /**
   * Update collection details
   */
  async updateCollection(
    id: string,
    dto: UpdateCollectionDto
  ): Promise<Collection> {
    const { data } = await apiCommunity.patch<any>(
      `/collections/${id}`,
      dto
    );
    return normalizeCollection(data);
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
    const { data } = await apiCommunity.patch<any>(
      `/collections/${collectionId}/close`,
      dto
    );
    return normalizeCollection(data);
  }

  /**
   * Download the official detailed PDF report for a specific collection
   * Endpoints: GET /collections/:id/report/pdf or GET /reports/collections/:id
   */
  async downloadCollectionReportPdf(collectionId: string, title?: string): Promise<void> {
    const response = await apiCommunity.get(`/collections/${collectionId}/report/pdf`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const cleanTitle = (title || collectionId).replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Informe_Colecta_${cleanTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Download the general consolidated PDF report of all collections
   * Endpoints: GET /collections/report/pdf or GET /reports/collections
   */
  async downloadCollectionsGeneralReportPdf(): Promise<void> {
    const response = await apiCommunity.get('/collections/report/pdf', {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Informe_General_Colectas_Solidarias.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const collectionsService = new CollectionsService();
