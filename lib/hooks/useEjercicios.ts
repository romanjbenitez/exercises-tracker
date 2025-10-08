import { useState, useEffect } from 'react';
import type { Ejercicio } from '../models/Ejercicio';
import { api } from '../api-client';

export function useEjercicios() {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from API on mount
    useEffect(() => {
        const cargarEjercicios = async () => {
            try {
                const data = await api.getEjercicios();
                setEjercicios(data);
            } catch (error) {
                console.error('Error al cargar ejercicios:', error);
            } finally {
                setLoading(false);
            }
        };
        cargarEjercicios();
    }, []);

    const crear = async (ejercicio: Ejercicio) => {
        try {
            await api.createEjercicio(ejercicio);
            setEjercicios(prev => [...prev, ejercicio]);
        } catch (error) {
            console.error('Error al crear ejercicio:', error);
            throw error;
        }
    };

    const actualizar = async (id: string, ejercicioActualizado: Partial<Ejercicio>) => {
        try {
            await api.updateEjercicio(id, ejercicioActualizado);
            setEjercicios(prev =>
                prev.map(ej => ej.id === id ? { ...ej, ...ejercicioActualizado } : ej)
            );
        } catch (error) {
            console.error('Error al actualizar ejercicio:', error);
            throw error;
        }
    };

    const eliminar = async (id: string) => {
        try {
            await api.deleteEjercicio(id);
            setEjercicios(prev => prev.filter(ej => ej.id !== id));
        } catch (error) {
            console.error('Error al eliminar ejercicio:', error);
            throw error;
        }
    };

    const obtenerPorId = (id: string): Ejercicio | undefined => {
        return ejercicios.find(ej => ej.id === id);
    };

    const obtenerTodos = (): Ejercicio[] => {
        return ejercicios;
    };

    return {
        ejercicios,
        loading,
        crear,
        actualizar,
        eliminar,
        obtenerPorId,
        obtenerTodos
    };
}
