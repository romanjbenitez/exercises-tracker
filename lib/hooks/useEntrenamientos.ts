import { useState, useEffect } from 'react';
import type { Entrenamiento } from '../models/Entrenamiento';
import { api } from '../api-client';

export function useEntrenamientos() {
    const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from API on mount
    useEffect(() => {
        cargarEntrenamientos();
    }, []);

    const cargarEntrenamientos = async () => {
        try {
            const data = await api.getEntrenamientos();
            setEntrenamientos(data);
        } catch (error) {
            console.error('Error al cargar entrenamientos:', error);
        } finally {
            setLoading(false);
        }
    };

    const crear = async (entrenamiento: Entrenamiento) => {
        try {
            await api.createEntrenamiento(entrenamiento);
            setEntrenamientos(prev => [...prev, entrenamiento]);
            return entrenamiento;
        } catch (error) {
            console.error('Error al crear entrenamiento:', error);
            throw error;
        }
    };

    const actualizar = async (id: string, entrenamientoActualizado: Partial<Entrenamiento>) => {
        try {
            await api.updateEntrenamiento(id, entrenamientoActualizado);
            setEntrenamientos(prev =>
                prev.map(e => e.id === id ? { ...e, ...entrenamientoActualizado } : e)
            );
        } catch (error) {
            console.error('Error al actualizar entrenamiento:', error);
            throw error;
        }
    };

    const eliminar = async (id: string) => {
        try {
            await api.deleteEntrenamiento(id);
            setEntrenamientos(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error al eliminar entrenamiento:', error);
            throw error;
        }
    };

    const obtenerPorId = (id: string): Entrenamiento | undefined => {
        return entrenamientos.find(e => e.id === id);
    };

    const obtenerPorRutina = (rutinaId: string): Entrenamiento[] => {
        return entrenamientos.filter(e => e.rutinaId === rutinaId);
    };

    const obtenerPorEjercicio = (ejercicioId: string): Entrenamiento[] => {
        return entrenamientos.filter(e =>
            e.ejercicios.some(ej => ej.ejercicioId === ejercicioId)
        );
    };

    const obtenerPorSemana = (semana: number): Entrenamiento[] => {
        return entrenamientos.filter(e => e.semana === semana);
    };

    const obtenerTodos = (): Entrenamiento[] => {
        return entrenamientos;
    };

    return {
        entrenamientos,
        loading,
        crear,
        actualizar,
        eliminar,
        obtenerPorId,
        obtenerPorRutina,
        obtenerPorEjercicio,
        obtenerPorSemana,
        obtenerTodos,
        recargar: cargarEntrenamientos
    };
}
