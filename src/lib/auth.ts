import apiCommunity from '@/utils/communityApi';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { Session } from 'types';

export const signIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  const response = await apiCommunity.post<{ token: string }>(
    '/auth/login',
    {},
    {
      headers: {
        Authorization: `Bearer ${btoa(`${email}:${password}`)}`
      }
    }
  );
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

export const auth = async (): Promise<{
  ok: boolean;
  data: Session | null;
}> => {
  // get token from cookies
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/auth/login');
  }
      try {
        const response = await apiCommunity.get<Session>('/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return { ok: true, data: response };
      } catch (error) {
        return { ok: false, data: null };
      }

};
