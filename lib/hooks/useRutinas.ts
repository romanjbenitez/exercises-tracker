import { useState, useEffect } from 'react';
import type { Rutina } from '../models/Rutina';
import { api } from '../api-client';

export function useRutinas() {
    const [rutinas, setRutinas] = useState<Rutina[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from API on mount
    useEffect(() => {
        const cargarRutinas = async () => {
            try {
                const data = await api.getRutinas();
                setRutinas(data);
            } catch (error) {
                console.error('Error al cargar rutinas:', error);
            } finally {
                setLoading(false);
            }
        };
        cargarRutinas();
    }, []);

    const crear = async (rutina: Rutina) => {
        try {
            await api.createRutina(rutina);
            setRutinas(prev => [...prev, rutina]);
        } catch (error) {
            console.error('Error al crear rutina:', error);
            throw error;
        }
    };

    const actualizar = async (id: string, rutinaActualizada: Partial<Rutina>) => {
        try {
            await api.updateRutina(id, rutinaActualizada);
            setRutinas(prev =>
                prev.map(rut => rut.id === id ? { ...rut, ...rutinaActualizada } : rut)
            );
        } catch (error) {
            console.error('Error al actualizar rutina:', error);
            throw error;
        }
    };

    const eliminar = async (id: string) => {
        try {
            await api.deleteRutina(id);
            setRutinas(prev => prev.filter(rut => rut.id !== id));
        } catch (error) {
            console.error('Error al eliminar rutina:', error);
            throw error;
        }
    };

    const obtenerPorId = (id: string): Rutina | undefined => {
        return rutinas.find(rut => rut.id === id);
    };

    const obtenerTodos = (): Rutina[] => {
        return rutinas;
    };

    const agregarEjercicio = async (rutinaId: string, ejercicioId: string) => {
        const rutina = rutinas.find(r => r.id === rutinaId);
        if (rutina) {
            const nuevosEjerciciosIds = [...rutina.ejerciciosIds, ejercicioId];
            await actualizar(rutinaId, { ejerciciosIds: nuevosEjerciciosIds });
        }
    };

    const eliminarEjercicio = async (rutinaId: string, ejercicioId: string) => {
        const rutina = rutinas.find(r => r.id === rutinaId);
        if (rutina) {
            const nuevosEjerciciosIds = rutina.ejerciciosIds.filter(id => id !== ejercicioId);
            await actualizar(rutinaId, { ejerciciosIds: nuevosEjerciciosIds });
        }
    };

    return {
        rutinas,
        loading,
        crear,
        actualizar,
        eliminar,
        obtenerPorId,
        obtenerTodos,
        agregarEjercicio,
        eliminarEjercicio
    };
}
