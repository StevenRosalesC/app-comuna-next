import apiCommunity from '@/utils/communityApi';

export interface MemberDocument {
  memberId: number;
  documentTypeId: string;
  filePath: string;
  originalFileName: string;
  lastUpdate: string;
  documentType: {
    alias: string;
    name: string;
  };
}

export interface UploadDocumentResponse {
  message: string;
  filePath: string;
}

export const memberDocumentsService = {
  /**
   * Upload a document for a member
   */
  async uploadDocument(
    memberId: string,
    file: File,
    documentTypeId: string
  ): Promise<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentTypeId', documentTypeId);

    const { data } = await apiCommunity.post<UploadDocumentResponse>(
      `/members/${memberId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  },

  /**
   * Get all documents for a member
   */
  async getMemberDocuments(memberId: string): Promise<MemberDocument[]> {
    const { data } = await apiCommunity.get<MemberDocument[]>(
      `/members/${memberId}/documents`
    );
    return data;
  },

  /**
   * Get metadata for a specific document
   */
  async getDocumentMetadata(
    memberId: string,
    documentTypeId: string
  ): Promise<MemberDocument> {
    const { data } = await apiCommunity.get<MemberDocument>(
      `/members/${memberId}/documents/${documentTypeId}`
    );
    return data;
  },

  /**
   * Download a document
   */
  async downloadDocument(
    memberId: string,
    documentTypeId: string
  ): Promise<Blob> {
    const { data } = await apiCommunity.get<Blob>(
      `/members/${memberId}/documents/${documentTypeId}/download`,
      {
        responseType: 'blob'
      }
    );
    return data;
  }
};
