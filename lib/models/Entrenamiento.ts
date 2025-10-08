// Representa una serie completada de un ejercicio en un entrenamiento
export interface SerieCompletada {
    repeticiones: number;
    peso: number;
}

// Representa un ejercicio completado en un entrenamiento
export interface EjercicioCompletado {
    ejercicioId: string;
    ejercicioNombre: string;
    series: SerieCompletada[];
}

// Representa una sesión de entrenamiento completa
export interface Entrenamiento {
    id: string;
    rutinaId: string;
    rutinaNombre: string;
    fecha: string; // ISO string
    semana: number;
    ejercicios: EjercicioCompletado[];
    notas?: string;
    duracion?: number; // en minutos
}

export function crearEntrenamiento(
    rutinaId: string,
    rutinaNombre: string,
    semana: number
): Entrenamiento {
    return {
        id: crypto.randomUUID(),
        rutinaId,
        rutinaNombre,
        fecha: new Date().toISOString(),
        semana,
        ejercicios: [],
        notas: ''
    };
}

// Helper para crear una serie completada vacía
export function crearSerieVacia(): SerieCompletada {
    return {
        repeticiones: 0,
        peso: 0
    };
}
