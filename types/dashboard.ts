export interface Notice {
  newsId: string;
  title: string;
  slug?: string;
  description: string;
  content: string;
  coverImageUrl: string;
  createdAt: string;
  updatedAt?: string;
  published: boolean;
  status: boolean;
  createdBy: string;
  type?: string;
}

export interface ImageKitData {
  type: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fileId: string;
  tags: null;
  AITags: null;
  versionInfo: VersionInfo;
  embeddedMetadata: EmbeddedMetadata;
  customCoordinates: null;
  customMetadata: {};
  isPrivateFile: boolean;
  url: string;
  thumbnail: string;
  fileType: string;
  filePath: string;
  height: number;
  width: number;
  size: number;
  hasAlpha: boolean;
  mime: string;
}

export interface VersionInfo {
  id: string;
  name: string;
}

export interface EmbeddedMetadata {
  YResolution: number;
  XResolution: number;
  DateCreated: string;
  DateTimeCreated: string;
}

export interface ImageData {
  id?: string;
  url: string;
  created_at?: string;
  bytes?: number;
  format: string;
  display_name: string;
  width: number;
  height: number;
}
