import { NextResponse } from 'next/server';
import { getEntrenamientos, createEntrenamiento } from '@/lib/google-sheets';

export async function GET() {
  try {
    const entrenamientos = await getEntrenamientos();
    return NextResponse.json(entrenamientos);
  } catch (error) {
    console.error('Error fetching entrenamientos:', error);
    return NextResponse.json({ error: 'Error al obtener entrenamientos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entrenamiento = await request.json();
    await createEntrenamiento(entrenamiento);
    return NextResponse.json(entrenamiento, { status: 201 });
  } catch (error) {
    console.error('Error creating entrenamiento:', error);
    return NextResponse.json({ error: 'Error al crear entrenamiento' }, { status: 500 });
  }
}
