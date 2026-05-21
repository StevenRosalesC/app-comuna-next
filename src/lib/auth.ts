import apiCommunity from '@/utils/communityApi';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthResponse } from 'types/response';
import { AUTH_CONFIG } from './auth-config';

export const signIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const { data: response } = await apiCommunity.post<{ token: string }>(
    '/auth/login',
    {},
    {
      headers: {
        Authorization: `Basic ${btoa(`${email}:${password}`)}`
      }
    }
  );
  const token = response.token;
  const cookieStore = await cookies();
  cookieStore.set(AUTH_CONFIG.COOKIE_NAME, token, AUTH_CONFIG.COOKIE_SETTINGS);
};

export const signOut = async () => {
  const cookieStore = await cookies();
  await apiCommunity.get('/auth/logout', {
    headers: {
      Authorization: `Bearer ${cookieStore.get(AUTH_CONFIG.COOKIE_NAME)?.value}`
    }
  });
};

export const auth = async (): Promise<{
  ok: boolean;
  data: AuthResponse | null;
}> => {
  // get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.COOKIE_NAME)?.value;
  if (!token) {
    redirect(AUTH_CONFIG.PATHS.LOGIN);
  }
  try {
    const { data: response } = await apiCommunity.get<AuthResponse>(
      '/auth/refresh',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return { ok: true, data: response };
  } catch (error) {
    return { ok: false, data: null };
  }
};
