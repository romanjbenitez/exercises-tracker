export interface Ejercicio {
    id: string;
    nombre: string;
    series: number;
    repeticiones: number[];
    pesos: number[];
}

export function crearEjercicio(nombre: string, series: number): Ejercicio {
    return {
        id: crypto.randomUUID(),
        nombre,
        series,
        repeticiones: Array(series).fill(0),
        pesos: Array(series).fill(0)
    };
}
