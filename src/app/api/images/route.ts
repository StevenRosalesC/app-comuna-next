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
    console.error('Error listing images:', error);
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
  const fileValue = formData.get('file');
  const fileNameValue = formData.get('filename');
  const folderValue = formData.get('folder');
  const widthValue = formData.get('width');
  const heightValue = formData.get('height');
  const formatValue = formData.get('format');
  const displayNameValue = formData.get('display_name');

  if (!(fileValue instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }
  if (typeof fileNameValue !== 'string' || !fileNameValue.trim()) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }
  if (typeof folderValue !== 'string' || !folderValue.trim()) {
    return NextResponse.json({ error: 'Folder is required' }, { status: 400 });
  }

  const width =
    typeof widthValue === 'string' && Number.isFinite(Number(widthValue))
      ? Number(widthValue)
      : undefined;
  const height =
    typeof heightValue === 'string' && Number.isFinite(Number(heightValue))
      ? Number(heightValue)
      : undefined;
  const format = typeof formatValue === 'string' ? formatValue : undefined;
  const displayName =
    typeof displayNameValue === 'string' ? displayNameValue : undefined;

  try {
    if (provider === 'minio') {
      const uploaded = await uploadImageToMinio({
        file: fileValue,
        filename: fileNameValue,
        folder: folderValue,
        width,
        height,
        format,
        displayName
      });
      return NextResponse.json(uploaded);
    }
    const { default: imageKitApi } = await import('@/utils/imagekitApi');
    const { transformImageKitData } = await import('@/utils/images');
    const fileBuffer = await fileValue.arrayBuffer();
    const response = await imageKitApi.upload({
      file: Buffer.from(fileBuffer),
      fileName: fileNameValue,
      folder: folderValue,
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
