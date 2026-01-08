import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Routes that require authentication
const protectedRoutes = ['/home', '/library', '/book', '/read'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (token) {
    const payload = await verifyToken(token);
    
    if (payload) {
      // User is authenticated
      if (isAuthRoute) {
        // Redirect to home if trying to access auth routes while logged in
        return NextResponse.redirect(new URL('/home', request.url));
      }
      return NextResponse.next();
    }
  }

  // User is not authenticated
  if (isProtectedRoute) {
    // Redirect to login if trying to access protected routes
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
