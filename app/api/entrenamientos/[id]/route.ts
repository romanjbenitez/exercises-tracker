import { NextResponse } from 'next/server';
import { getEntrenamientoById, updateEntrenamiento, deleteEntrenamiento } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entrenamiento = await getEntrenamientoById(id);

    if (!entrenamiento) {
      return NextResponse.json({ error: 'Entrenamiento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(entrenamiento);
  } catch (error) {
    console.error('Error fetching entrenamiento:', error);
    return NextResponse.json({ error: 'Error al obtener entrenamiento' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await updateEntrenamiento(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating entrenamiento:', error);
    return NextResponse.json({ error: 'Error al actualizar entrenamiento' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEntrenamiento(id);
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting entrenamiento:', error);
    return NextResponse.json({ error: 'Error al eliminar entrenamiento' }, { status: 500 });
  }
}
