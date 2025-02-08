import imageKitApi from '@/utils/imagekitApi';
import {
  transformImageKitData,
  transformImageKitDataArray
} from '@/utils/images';
import { NextRequest, NextResponse } from 'next/server';
import { ImageKitData } from 'types/dashboard';

export async function GET() {
  try {
    const response = await imageKitApi.listFiles({
      path: '/app-comuna/news-images',
      fileType: 'image'
    });
    const convertedData = transformImageKitDataArray(
      response as unknown as ImageKitData[]
    );
    return NextResponse.json(convertedData);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const fileBuffer = await (file as File).arrayBuffer();
  const fileName = formData.get('filename') as string;
  const folder = formData.get('folder') as string;

  try {
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
    return NextResponse.json({ error }, { status: 500 });
  }
}
