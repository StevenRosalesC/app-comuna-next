import { FetchInstance } from '@/lib/fetchInstance';

const url = process.env.NEXT_PUBLIC_API_URL as string;
const apiCommunity = new FetchInstance(url, {
  // next:{revalidate:60},
  cache: 'no-store'
});

export default apiCommunity;
