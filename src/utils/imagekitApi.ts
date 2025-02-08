import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from "@/lib/env.config";
import ImageKit from "imagekit";

const privateKey = IMAGEKIT_PRIVATE_KEY;
const publicKey = IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = IMAGEKIT_URL_ENDPOINT;

var imageKitApi = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint
});

export default imageKitApi;