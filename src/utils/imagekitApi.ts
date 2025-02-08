import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } from "@/lib/env.config";
import { FetchInstance } from "@/lib/fetchInstance";

const imageKitApi = new FetchInstance(IMAGEKIT_URL_ENDPOINT, {
  headers: {
    Accept: 'application/json',
    Authorization : `Basic ${IMAGEKIT_PRIVATE_KEY}`,
  },
  cache: 'no-store',
});

export default imageKitApi;