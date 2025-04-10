import { NextResponse, type NextRequest } from 'next/server';
import apiCommunity from './utils/communityApi';
import { AuthResponse } from 'types/response';
import { cookies } from 'next/headers';

// Constants for paths and cookie settings
const PATHS = {
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard/overview'
} as const;

const COOKIE_SETTINGS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/'
} as const;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const cookieStore = cookies();
  const { pathname } = request.nextUrl;

  // Handle public routes
  if (pathname === PATHS.FORGOT_PASSWORD) {
    return NextResponse.next();
  }

  if (pathname === PATHS.LOGIN) {
    if (!token) return NextResponse.next();
    
    const isAuthenticated = await authenticateOrRefresh(token);
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(PATHS.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
  }

  const refreshResponse = await authenticateOrRefresh(token);
  if (!refreshResponse) {
    cookieStore.delete('token');
    return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
  }

  const response = NextResponse.next();
  if (refreshResponse.token) {
    response.cookies.set('token', refreshResponse.token, COOKIE_SETTINGS);
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
