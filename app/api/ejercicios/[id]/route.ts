import { NextResponse } from 'next/server';
import { getEjercicioById, updateEjercicio, deleteEjercicio } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ejercicio = await getEjercicioById(id);

    if (!ejercicio) {
      return NextResponse.json({ error: 'Ejercicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(ejercicio);
  } catch (error) {
    console.error('Error fetching ejercicio:', error);
    return NextResponse.json({ error: 'Error al obtener ejercicio' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await updateEjercicio(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ejercicio:', error);
    return NextResponse.json({ error: 'Error al actualizar ejercicio' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🗑️ Deleting ejercicio:', id);
    await deleteEjercicio(id);
    console.log('✅ Ejercicio deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting ejercicio:', error);
    return NextResponse.json({ error: 'Error al eliminar ejercicio' }, { status: 500 });
  }
}
