import { NextResponse, type NextRequest } from 'next/server';
import apiCommunity from './utils/communityApi';

export async function middleware(request: NextRequest) {
  let token = request.cookies.get('token')?.value;
  let refreshToken = request.cookies.get('refreshToken')?.value;

  // Permitir acceso a /auth/login libremente si no hay sesión
  if (request.nextUrl.pathname === '/auth/login') {
    if (!token) return NextResponse.next();

    const isAuthenticated = await authenticateOrRefresh(token, refreshToken);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard/overview', request.url));
    }
    return NextResponse.next();
  }

  // Para rutas protegidas, redirigir a login si no hay token
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Intentar autenticar o refrescar el token
  const newToken = await authenticateOrRefresh(token, refreshToken);
  if (!newToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si el token fue refrescado, actualizarlo en las cookies
  const responseWithNewToken = NextResponse.next();
  if (newToken !== token) {
    responseWithNewToken.cookies.set('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  return responseWithNewToken;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};

// Función para autenticar o refrescar el token
async function authenticateOrRefresh(token: string, refreshToken?: string) {
  try {
    const response = await auth(token);
    if (response.ok) return token;

    if (refreshToken) {
      const newToken = await refreshTokenRequest(refreshToken);
      if (newToken) {
        return newToken;
      }
    }
  } catch (error) {
    return null;
  }
  return null;
}

// Función para autenticar el token
async function auth(token: string) {
  try {
    const response = await apiCommunity.get('/auth/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { ok: true, data: response };
  } catch (error) {
    return { ok: false, data: null };
  }
}

// Función para refrescar el token
async function refreshTokenRequest(refreshToken: string) {
  try {
    const response = await apiCommunity.post<{ token: string }>(
      '/auth/refresh',
      {
        refreshToken
      }
    );
    return response.token;
  } catch (error) {}
  return null;
}
