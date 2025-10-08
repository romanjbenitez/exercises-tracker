import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'gym_tracker_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar si tiene la cookie de autenticación
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Si no está autenticado, redirigir a login
  if (!authCookie || authCookie.value !== 'authenticated') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado, permitir acceso
  return NextResponse.next();
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
