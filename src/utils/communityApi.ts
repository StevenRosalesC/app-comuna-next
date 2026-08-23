import { getToken } from '@/app/actions/auth-actions';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL as string;

if (!url) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const apiCommunity = axios.create({
  baseURL: url,
  timeout: 10000 // 10 seconds timeout
});

let cachedClientToken: string | null = null;

export const setClientToken = (token: string | null) => {
  cachedClientToken = token;
};

export const getClientToken = () => cachedClientToken;

// Request interceptor
apiCommunity.interceptors.request.use(
  async (config) => {
    let token = cachedClientToken;
    if (!token && typeof window !== 'undefined') {
      const serverToken = await getToken();
      token = serverToken || null;
      if (token) {
        cachedClientToken = token;
      }
    } else if (!token && typeof window === 'undefined') {
      const serverToken = await getToken();
      token = serverToken || null;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
