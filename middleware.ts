// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (!accessToken) {
    // Користувач не авторизований
    if (isPrivateRoute) return NextResponse.redirect(new URL('/sign-in', request.url));
    return NextResponse.next();
  }

  // Користувач авторизований
  if (isPublicRoute) return NextResponse.redirect(new URL('/', request.url));
  if (isPrivateRoute) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
