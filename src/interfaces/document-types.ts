export interface DocumentType {
  documentTypeId: string;
  name: string;
  alias: string;
  status: boolean;
}

export interface CreateDocumentType {
  name: string;
  status?: boolean;
}

export interface UpdateDocumentType {
  name?: string;
  status?: boolean;
}
