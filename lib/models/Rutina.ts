export interface Rutina {
    id: string;
    nombre: string;
    descripcion?: string;
    ejerciciosIds: string[];
    fechaCreacion: string;
}

export function crearRutina(nombre: string, descripcion?: string): Rutina {
    return {
        id: crypto.randomUUID(),
        nombre,
        descripcion,
        ejerciciosIds: [],
        fechaCreacion: new Date().toISOString()
    };
}
