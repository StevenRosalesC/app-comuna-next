import apiCommunity from '@/utils/communityApi';

export interface Neighborhood {
  neighborhoodId: string;
  neighborhoodName: string;
  persons?: Person[];
  _count?: {
    persons: number;
  };
}

export interface CreateNeighborhoodDto {
  neighborhoodName: string;
}

export interface UpdateNeighborhoodDto {
  neighborhoodName: string;
}

export interface PaginationResponse<T> {
  neighborhoods: T[];
  count: number;
}

interface Person {
  personId: string;
  firstName: string;
  lastName: string;
  identification: string;
}

class NeighborhoodsService {
  // Get all neighborhoods with pagination and search
  async getNeighborhoods(params: {
    limit?: number;
    offset?: number;
    search?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginationResponse<Neighborhood>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const { data } = await apiCommunity.get<PaginationResponse<Neighborhood>>(
      `/neighborhoods?${queryParams.toString()}`
    );
    return data;
  }

  // Get neighborhood by ID
  async getNeighborhood(id: string): Promise<Neighborhood> {
    const { data } = await apiCommunity.get<Neighborhood>(`/neighborhoods/${id}`);
    return data;
  }

  // Create new neighborhood
  async createNeighborhood(dto: CreateNeighborhoodDto): Promise<Neighborhood> {
    const { data } = await apiCommunity.post<Neighborhood>('/neighborhoods', dto);
    return data;
  }

  // Update neighborhood
  async updateNeighborhood(id: string, dto: UpdateNeighborhoodDto): Promise<Neighborhood> {
    const { data } = await apiCommunity.patch<Neighborhood>(`/neighborhoods/${id}`, dto);
    return data;
  }

  // Delete neighborhood
  async deleteNeighborhood(id: string): Promise<Neighborhood> {
    const { data } = await apiCommunity.delete<Neighborhood>(`/neighborhoods/${id}`);
    return data;
  }
}

export const neighborhoodsService = new NeighborhoodsService(); 