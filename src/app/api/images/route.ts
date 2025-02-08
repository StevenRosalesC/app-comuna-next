import imageKitApi from "@/utils/imagekitApi";
import { transformImagekitData } from "@/utils/images";
import { NextRequest, NextResponse } from "next/server";
import { ImageKitData,ImageData } from "types/dashboard";


export async function GET (){
    const response = await imageKitApi.get<ImageKitData[]>('/files?type=file&path=%2Fapp-comuna%2Fnews-images&fileType=image');
    const convertedData = transformImagekitData(response);
    return NextResponse.json(convertedData);
}

export async function POST (request : NextRequest){
    const formData = await request.formData();
    console.log(formData);
    try {
        const response = await imageKitApi.post<Response>('/files/upload', formData);
        console.log(response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({error}, {status: 500});
        
    }
}