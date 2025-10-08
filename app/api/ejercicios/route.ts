import { NextResponse } from 'next/server';
import { getEjercicios, createEjercicio } from '@/lib/google-sheets';

export async function GET() {
  try {
    const ejercicios = await getEjercicios();
    return NextResponse.json(ejercicios);
  } catch (error) {
    console.error('Error fetching ejercicios:', error);
    return NextResponse.json({ error: 'Error al obtener ejercicios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ejercicio = await request.json();
    await createEjercicio(ejercicio);
    return NextResponse.json(ejercicio, { status: 201 });
  } catch (error) {
    console.error('Error creating ejercicio:', error);
    return NextResponse.json({ error: 'Error al crear ejercicio' }, { status: 500 });
  }
}
