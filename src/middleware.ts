import { NextResponse, type NextRequest } from 'next/server';
import apiCommunity from './utils/communityApi';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname === '/auth/login') {
    if (!token) {
      return NextResponse.next();
    }


    try {
      const response = await auth(token);
      if (response.ok) {
        return NextResponse.redirect(new URL('/dashboard/overview', request.url));
      }
    } catch (error) {
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const response = await auth(token);
    if (!response.ok) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
export const auth = async (token: string) => {
  try {
    const response = await apiCommunity.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return { ok: true, data: response };
  } catch (error) {
    return { ok: false, data: null };
  }
};
