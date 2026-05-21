import {
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import {
  MINIO_ACCESS_KEY,
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PUBLIC_URL,
  MINIO_REGION,
  MINIO_SECRET_KEY
} from '@/lib/env.config';

const assertMinioConfig = () => {
  const missing: string[] = [];
  if (!MINIO_ENDPOINT) missing.push('MINIO_ENDPOINT');
  if (!MINIO_ACCESS_KEY) missing.push('MINIO_ACCESS_KEY');
  if (!MINIO_SECRET_KEY) missing.push('MINIO_SECRET_KEY');
  if (!MINIO_BUCKET) missing.push('MINIO_BUCKET');
  if (!MINIO_PUBLIC_URL) missing.push('MINIO_PUBLIC_URL');
  if (missing.length) {
    throw new Error(`Missing MinIO env vars: ${missing.join(', ')}`);
  }
};

const getS3Client = () => {
  assertMinioConfig();
  const endpoint = MINIO_ENDPOINT as string;
  const accessKeyId = MINIO_ACCESS_KEY as string;
  const secretAccessKey = MINIO_SECRET_KEY as string;
  return new S3Client({
    endpoint,
    region: MINIO_REGION || 'us-east-1',
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    forcePathStyle: true
  });
};

const encodePath = (value: string) =>
  value
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

const getPublicObjectUrl = (key: string) => {
  assertMinioConfig();
  const publicUrl = MINIO_PUBLIC_URL as string;
  const base = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  return `${base}/${MINIO_BUCKET}/${encodePath(key)}`;
};

const folderToPrefix = (folder: string) => {
  assertMinioConfig();
  const normalized = folder.replace(/^\/+|\/+$/g, '');
  if (!normalized) return '';
  const parts = normalized.split('/').filter(Boolean);
  if (parts[0] === MINIO_BUCKET) parts.shift();
  return parts.join('/');
};

const getKeyParts = (key: string) => {
  const fileName = key.split('/').pop() || key;
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
  const displayName = fileName.replace(/\.[^/.]+$/, '');
  return { fileName, ext, displayName };
};

const getImageMetaFromBuffer = async (buffer: Buffer) => {
  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;
    const meta = await sharp(buffer).metadata();
    const width = typeof meta.width === 'number' ? meta.width : undefined;
    const height = typeof meta.height === 'number' ? meta.height : undefined;
    const format = typeof meta.format === 'string' ? meta.format : undefined;
    return { width, height, format };
  } catch (error) {
    return {};
  }
};

const getMimeTypeFromFilename = (filename: string) => {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'svg':
      return 'image/svg+xml';
    case 'bmp':
      return 'image/bmp';
    case 'tif':
    case 'tiff':
      return 'image/tiff';
    default:
      return undefined;
  }
};

export const uploadImageToMinio = async (input: {
  file: File;
  folder: string;
  filename: string;
  width?: number;
  height?: number;
  format?: string;
  displayName?: string;
}) => {
  const client = getS3Client();
  const buffer = Buffer.from(await input.file.arrayBuffer());
  const prefix = folderToPrefix(input.folder);
  const safeBase = input.filename.replace(/[^\w.\- ]+/g, '').trim() || 'image';
  const unique = crypto.randomUUID();
  const key = prefix ? `${prefix}/${unique}-${safeBase}` : `${unique}-${safeBase}`;

  const bufferMeta = await getImageMetaFromBuffer(buffer);
  const width = input.width ?? bufferMeta.width;
  const height = input.height ?? bufferMeta.height;
  const format = input.format ?? bufferMeta.format;
  const displayName = input.displayName || safeBase.replace(/\.[^/.]+$/, '');
  const contentType = input.file.type || getMimeTypeFromFilename(safeBase);

  const metadata: Record<string, string> = {};
  if (width) metadata.width = String(width);
  if (height) metadata.height = String(height);
  if (format) metadata.format = format;
  if (displayName) metadata.display_name = displayName;

  await client.send(
    new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata
    })
  );

  return {
    id: key,
    url: getPublicObjectUrl(key),
    format: format || input.file.type.split('/')[1] || '',
    display_name: displayName,
    width: width || 1200,
    height: height || 630
  };
};

export const listImagesFromMinio = async (input: { folder: string }) => {
  const client = getS3Client();
  const prefix = folderToPrefix(input.folder);
  const listPrefix = prefix ? `${prefix.replace(/\/+$/g, '')}/` : undefined;

  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: MINIO_BUCKET,
      Prefix: listPrefix,
      MaxKeys: 200
    })
  );

  const keys = (listed.Contents || [])
    .map((o) => o.Key)
    .filter((k): k is string => Boolean(k));

  const results = await Promise.all(
    keys.map(async (key) => {
      const head = await client.send(
        new HeadObjectCommand({ Bucket: MINIO_BUCKET, Key: key })
      );
      const metadata = head.Metadata || {};
      const { ext, displayName } = getKeyParts(key);
      const width = parseInt(metadata.width || '', 10);
      const height = parseInt(metadata.height || '', 10);
      const format = metadata.format || ext || '';
      const display_name = metadata.display_name || displayName;

      return {
        id: key,
        url: getPublicObjectUrl(key),
        format,
        display_name,
        width: Number.isFinite(width) && width > 0 ? width : 1200,
        height: Number.isFinite(height) && height > 0 ? height : 630
      };
    })
  );

  return results.reverse();
};
