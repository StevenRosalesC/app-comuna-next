import { ImageData, ImageKitData } from "types/dashboard";

export const transformImagekitData = (data: ImageKitData[]): ImageData[] => {
  let newData: ImageData[] = [];
  data.forEach((image) => {
    newData.push({
      url: image.url,
      format: image.fileType,
      display_name: image.name,
      width: image.width,
      height: image.height,
    });
  });
  return newData;
}