import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    console.log('🔐 Login attempt');
    console.log('Password received:', password ? '***' : 'EMPTY');
    console.log('AUTH_PASSWORD env:', process.env.AUTH_PASSWORD ? 'SET' : 'NOT SET');

    if (!password) {
      console.log('❌ No password provided');
      return NextResponse.json(
        { error: 'Se requiere contraseña' },
        { status: 400 }
      );
    }

    // Verificar contraseña
    const isValid = verifyPassword(password);
    console.log('Password validation result:', isValid);

    if (!isValid) {
      console.log('❌ Invalid password');
      console.log('Expected:', process.env.AUTH_PASSWORD);
      console.log('Received:', password);
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    console.log('✅ Login successful');

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
