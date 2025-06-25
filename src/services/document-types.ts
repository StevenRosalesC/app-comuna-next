import { DocumentType, CreateDocumentType, UpdateDocumentType } from '@/interfaces/document-types';
import apiCommunity from '@/utils/communityApi';

export const documentTypesService = {
  async list(
    limit: number = 10,
    offset: number = 0,
    search?: string,
    orderBy: string = 'name',
    order: 'asc' | 'desc' = 'asc',
    status?: boolean
  ): Promise<{ data: DocumentType[]; count: number }> {
    const params: any = { limit, offset, orderBy, order };
    if (search) params.search = search;
    if (status !== undefined) params.status = status;

    const response = await apiCommunity.get('/document-types', { params });
    return { data: response.data.data, count: response.data.count };
  },

  async listAll(): Promise<DocumentType[]> {
    const { data } = await apiCommunity.get('/document-types?limit=1000');
    return data.data;
  },

  async getById(id: string): Promise<DocumentType> {
    const { data } = await apiCommunity.get(`/document-types/${id}`);
    return data;
  },

  async create(data: CreateDocumentType): Promise<DocumentType> {
    try {
      const { data: newDocType } = await apiCommunity.post('/document-types', data);
      return newDocType;
    } catch (error) {
      throw new Error('Error al crear el tipo de documento');
    }
  },

  async update(id: string, data: UpdateDocumentType): Promise<DocumentType> {
    try {
      const { data: updatedDocType } = await apiCommunity.patch(`/document-types/${id}`, data);
      return updatedDocType;
    } catch (error) {
      throw new Error('Error al actualizar el tipo de documento');
    }
  },

  async remove(id: string): Promise<boolean> {
    try {
      const { data } = await apiCommunity.delete(`/document-types/${id}`);
      return data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al eliminar el tipo de documento');
    }
  },
}; 