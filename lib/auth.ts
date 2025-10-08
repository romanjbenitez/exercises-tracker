import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'gym_tracker_auth';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD!;

// Verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie) return false;

  // Verificar que el valor de la cookie sea correcto
  return authCookie.value === 'authenticated';
}

// Verificar la contraseña
export function verifyPassword(password: string): boolean {
  return password === AUTH_PASSWORD;
}

// Crear respuesta de autenticación exitosa con cookie
export function createAuthResponse(redirectTo: string = '/'): NextResponse {
  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'));

  // Establecer cookie que expira en 30 días
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: 'authenticated',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: '/',
  });

  return response;
}

// Crear respuesta de logout
export function createLogoutResponse(redirectTo: string = '/login'): NextResponse {
  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'));

  // Eliminar cookie
  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}

// Verificar autenticación en API routes
export async function requireAuth(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  return null; // null significa que está autenticado
}
