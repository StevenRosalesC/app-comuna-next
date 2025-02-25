import { NextResponse, type NextRequest } from 'next/server';
import apiCommunity from './utils/communityApi';
import { AuthResponse } from 'types/response';
import { cookies } from 'next/headers';
export async function middleware(request: NextRequest) {
  let token = request.cookies.get('token')?.value;
  const cookieStore = cookies();
  const {pathname} = request.nextUrl;
  // Permitir acceso a /auth/login libremente si no hay sesión
  if (pathname === '/auth/login') {
    if (!token) return NextResponse.next();

    const isAuthenticated = await authenticateOrRefresh(token);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard/overview', request.url));
    }
    return NextResponse.next();
  }

  // Para rutas protegidas, redirigir a login si no hay token
  if (!token) {
    console.log('NO HAY TOKEN');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Intentar autenticar o refrescar el token
  const refreshResponse = await authenticateOrRefresh(token);
  if (!refreshResponse) {
    // delete token from cookies
    cookieStore.delete('token');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si el token fue refrescado, actualizarlo en las cookies
  const responseWithNewToken = NextResponse.next();
  if (refreshResponse.token) {
    responseWithNewToken.cookies.set('token', refreshResponse.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  return responseWithNewToken;
}

export const config = {
// omit forgot-password and login pages from middleware
  matcher: ['/dashboard/:path*', '/auth/:path*',],
};

// Función para autenticar o refrescar el token
async function authenticateOrRefresh(token: string, refreshToken?: string) {
  try {
    const response = await refreshTokenRequest(token);
    console.log({refreshToken})
    if (response) return response;
  } catch (error) {
    return null;
  }
  return null;
}

// Función para refrescar el token
async function refreshTokenRequest(refreshToken: string) {
  try {
    const {data:response} = await apiCommunity.get<AuthResponse>(
      '/auth/refresh',
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );
    return response;
  } catch (error) {
    return null;
  }
}
