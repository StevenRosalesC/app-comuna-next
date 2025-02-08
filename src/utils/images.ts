import { ImageData, ImageKitData } from 'types/dashboard';

export const transformImageKitData = (data: ImageKitData): ImageData => {
  return {
    id: data.fileId,
    url: data.url,
    format: data.fileType,
    display_name: data.name,
    width: data.width,
    height: data.height
  };
};

export const transformImageKitDataArray = (
  data: ImageKitData[]
): ImageData[] => {
  return data.map((image) => ({
    id: image.fileId,
    url: image.url,
    format: image.fileType,
    display_name: image.name,
    width: image.width,
    height: image.height
  }));
};
