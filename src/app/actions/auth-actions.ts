'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import apiCommunity from '@/utils/communityApi';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };
  let redirectPath = '/dashboard/overview';

  try {
    const response = await apiCommunity.post<{
      token: string;
      refreshToken: string;
    }>(
      '/auth/login',
      {},
      {
        headers: {
          Authorization: `Bearer ${btoa(`${data.email}:${data.password}`)}`
        }
      }
    );
    if (!response?.token) {
      throw new Error('Invalid token response');
    }
    const token = response.token;
    // Guardar el token en una cookie
    cookies().set('token', token);
    cookies().set('refreshToken', response.refreshToken);
    return {
      ok: true
    };
  } catch (error) {
    // Opcional: redirigir a una página de error
    return {
      ok: false
    };
  } finally {
    revalidatePath(redirectPath, 'layout');
  }
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
  let redirectPath = '/';
  try {
    await apiCommunity.get('/auth/logout', {
      headers: {
        Authorization: `Bearer ${cookies().get('token')?.value}`
      }
    });
    cookies().set('token', '');
    cookies().set('refreshToken', '');
    redirectPath = '/auth/login';
  } catch (error) {
    // Opcional: redirigir a una página de error
    redirectPath = '/error';
  } finally {
    revalidatePath(redirectPath, 'layout');
    redirect(redirectPath);
  }
}
