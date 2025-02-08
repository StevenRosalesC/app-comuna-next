import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (request.nextUrl.pathname === '/auth/login' && !token?.value) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/auth/login' && token?.value) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/overview';
    return NextResponse.redirect(url);
  }

  if (!token?.value) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
