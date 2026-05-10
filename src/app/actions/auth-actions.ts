'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import apiCommunity from '@/utils/communityApi';
import { cookies } from 'next/headers';
import { AUTH_CONFIG } from '@/lib/auth-config';

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  try {
    const { data: response } = await apiCommunity.post<{
      token: string;
      refreshToken: string;
    }>(
      '/auth/login',
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}`
        }
      }
    );

    if (!response?.token) {
      return { ok: false, error: 'Invalid credentials' };
    }

    const token = response.token;
    // Guardar el token en una cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_CONFIG.COOKIE_NAME, token, AUTH_CONFIG.COOKIE_SETTINGS);

    return { ok: true };
  } catch (error: any) {
    // Delete the cookie on error
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_CONFIG.COOKIE_NAME);

    // Return specific error message based on the error
    if (error.response?.status === 401) {
      return { ok: false, error: 'Invalid email or password' };
    } else if (error.response?.status === 400) {
      return { ok: false, error: 'Invalid request data' };
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return { ok: false, error: 'Unable to connect to server' };
    } else {
      return { ok: false, error: 'An unexpected error occurred' };
    }
  }
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_CONFIG.COOKIE_NAME)?.value;
}

// export async function signup(formData: FormData) {
//   const supabase = await createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     redirect('/error');
//   }

//   revalidatePath('/', 'layout');
//   redirect('/');
// }

export async function logout() {
  try {
    // Optionally call logout endpoint if available
    try {
      const token = await getToken();
      if (token) {
        await apiCommunity.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
      // Continue with logout even if API call fails
    }

    // Clear the token cookie
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_CONFIG.COOKIE_NAME);

    revalidatePath('/', 'layout');
    redirect(AUTH_CONFIG.PATHS.LOGIN);
  } catch (error) {
    redirect(AUTH_CONFIG.PATHS.LOGIN);
  }
}
