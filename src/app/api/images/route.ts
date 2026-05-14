import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_PROVIDER } from '@/lib/env.config';
import { listImagesFromMinio, uploadImageToMinio } from '@/utils/minioApi';
import { ImageKitData } from 'types/dashboard';

const resolveProvider = (value?: string | null) => {
  if (value === 'minio' || value === 'imagekit') return value;
  return undefined;
};

export async function GET(request: NextRequest) {
  const provider =
    resolveProvider(request.nextUrl.searchParams.get('provider')) ||
    STORAGE_PROVIDER ||
    'imagekit';
  try {
    if (provider === 'minio') {
      const response = await listImagesFromMinio({
        folder: '/app-comuna/news-images'
      });
      return NextResponse.json(response);
    }
    const { default: imageKitApi } = await import('@/utils/imagekitApi');
    const { transformImageKitDataArray } = await import('@/utils/images');
    const response = await imageKitApi.listFiles({
      path: '/app-comuna/news-images',
      fileType: 'image'
    });
    const convertedData = transformImageKitDataArray(
      response as unknown as ImageKitData[]
    );
    return NextResponse.json(convertedData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : (() => {
            try {
              return JSON.stringify(error);
            } catch {
              return String(error);
            }
          })();
    return NextResponse.json({ provider, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const provider =
    resolveProvider(request.nextUrl.searchParams.get('provider')) ||
    STORAGE_PROVIDER ||
    'imagekit';
  const formData = await request.formData();
  const file = formData.get('file');
  const fileName = formData.get('filename') as string;
  const folder = formData.get('folder') as string;
  const width = formData.get('width') as string | null;
  const height = formData.get('height') as string | null;
  const format = formData.get('format') as string | null;
  const displayName = formData.get('display_name') as string | null;

  try {
    if (provider === 'minio') {
      const uploaded = await uploadImageToMinio({
        file: file as File,
        filename: fileName,
        folder,
        width: width ? parseInt(width, 10) : undefined,
        height: height ? parseInt(height, 10) : undefined,
        format: format || undefined,
        displayName: displayName || undefined
      });
      return NextResponse.json(uploaded);
    }
    const { default: imageKitApi } = await import('@/utils/imagekitApi');
    const { transformImageKitData } = await import('@/utils/images');
    const fileBuffer = await (file as File).arrayBuffer();
    const response = await imageKitApi.upload({
      file: Buffer.from(fileBuffer),
      fileName: fileName,
      folder: folder,
      tags: ['app-comuna'],
      useUniqueFileName: true
    });
    const convertedData = transformImageKitData(
      response as unknown as ImageKitData
    );
    return NextResponse.json(convertedData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : (() => {
            try {
              return JSON.stringify(error);
            } catch {
              return String(error);
            }
          })();
    return NextResponse.json({ provider, error: message }, { status: 500 });
  }
}
