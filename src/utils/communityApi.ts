import { getToken } from '@/app/actions/auth-actions';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL as string;

if (!url) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const apiCommunity = axios.create({
  baseURL: url,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
apiCommunity.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
apiCommunity.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiCommunity;
