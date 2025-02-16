import { getToken } from '@/app/actions/auth-actions';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL as string;
const apiCommunity = axios.create({
  baseURL: url,
  adapter:'fetch',
  fetchOptions: {
    cache:"force-cache"
  }
});

apiCommunity.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiCommunity;

