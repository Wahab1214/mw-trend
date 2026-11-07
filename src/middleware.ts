import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (excluding /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('mw_admin_session');

    // If no admin session cookie exists, redirect to login page immediately
    if (!adminSession || !adminSession.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting /admin/login, redirect into admin dashboard
  if (pathname === '/admin/login') {
    const adminSession = request.cookies.get('mw_admin_session');
    if (adminSession && adminSession.value) {
      const redirectParam = request.nextUrl.searchParams.get('redirect');
      const target =
        redirectParam && redirectParam.startsWith('/admin') && redirectParam !== '/admin/login'
          ? redirectParam
          : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
