import { FetchInstance } from './fetchInstance';

// Create API client instance
export const apiClient = new FetchInstance(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  apiClient.setAuthorization(token);
}; 