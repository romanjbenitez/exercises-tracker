import { NextResponse } from 'next/server';
import { getRutinas, createRutina } from '@/lib/google-sheets';

export async function GET() {
  try {
    const rutinas = await getRutinas();
    return NextResponse.json(rutinas);
  } catch (error) {
    console.error('Error fetching rutinas:', error);
    return NextResponse.json({ error: 'Error al obtener rutinas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rutina = await request.json();
    await createRutina(rutina);
    return NextResponse.json(rutina, { status: 201 });
  } catch (error) {
    console.error('Error creating rutina:', error);
    return NextResponse.json({ error: 'Error al crear rutina' }, { status: 500 });
  }
}
