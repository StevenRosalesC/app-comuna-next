import { NextResponse, type NextRequest } from 'next/server';
import apiCommunity from './utils/communityApi';
import { AuthResponse } from 'types/response';
import { AUTH_CONFIG } from './lib/auth-config';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Handle public routes
  if (
    pathname === AUTH_CONFIG.PATHS.FORGOT_PASSWORD ||
    pathname.startsWith('/auth/reset-password/')
  ) {
    return NextResponse.next();
  }

  if (pathname === AUTH_CONFIG.PATHS.LOGIN) {
    if (!token) return NextResponse.next();
    
    const isAuthenticated = await authenticateOrRefresh(token);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(AUTH_CONFIG.PATHS.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    return NextResponse.redirect(new URL(AUTH_CONFIG.PATHS.LOGIN, request.url));
  }

  const refreshResponse = await authenticateOrRefresh(token);
  if (!refreshResponse) {
    const response = NextResponse.redirect(new URL(AUTH_CONFIG.PATHS.LOGIN, request.url));
    response.cookies.delete(AUTH_CONFIG.COOKIE_NAME);
    return response;
  }

  const response = NextResponse.next();
  if (refreshResponse.token) {
    response.cookies.set(AUTH_CONFIG.COOKIE_NAME, refreshResponse.token, AUTH_CONFIG.COOKIE_SETTINGS);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};

// Helper functions
async function authenticateOrRefresh(token: string): Promise<AuthResponse | null> {
  try {
    const response = await refreshTokenRequest(token);
    return response;
  } catch (error) {
    return null;
  }
}

async function refreshTokenRequest(token: string): Promise<AuthResponse | null> {
  try {
    const { data: response } = await apiCommunity.get<AuthResponse>('/auth/refresh', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return null;
  }
}
