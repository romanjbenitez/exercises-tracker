import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Se requiere contraseña' },
        { status: 400 }
      );
    }

    // Verificar contraseña
    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear respuesta con cookie
    const response = NextResponse.json({ success: true });

    // Establecer cookie que expira en 30 días
    response.cookies.set({
      name: 'gym_tracker_auth',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
