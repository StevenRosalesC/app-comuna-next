import apiCommunity from '@/utils/communityApi';
import { cookies } from 'next/headers';
import { Session } from 'types';

export const signIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const response = await apiCommunity.post<{ token: string }>('/auth/login', {}, {
    headers: {
      Authorization: `Bearer ${btoa(`${email}:${password}`)}`
    }
  });
  const token = response.token;
  cookies().set('token', token);
};

export const signOut = async () => {
  await apiCommunity.get('/auth/logout', {
    headers: {
      Authorization: `Bearer ${cookies().get('token')?.value}`
    }
  });
};

export const auth = async (): Promise<Session | null> => {

  // Obtén el usuario autenticado de forma segura
  const token = cookies().get('token')?.value;
  try {
    const response = await apiCommunity.get<Session>('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return null;
  }
};
