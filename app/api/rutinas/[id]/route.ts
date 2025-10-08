import { NextResponse } from 'next/server';
import { getRutinaById, updateRutina, deleteRutina } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rutina = await getRutinaById(id);

    if (!rutina) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rutina);
  } catch (error) {
    console.error('Error fetching rutina:', error);
    return NextResponse.json({ error: 'Error al obtener rutina' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await updateRutina(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating rutina:', error);
    return NextResponse.json({ error: 'Error al actualizar rutina' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteRutina(id);
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting rutina:', error);
    return NextResponse.json({ error: 'Error al eliminar rutina' }, { status: 500 });
  }
}
