'use client';

import React, { useState } from 'react';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import type { Rutina } from '@/lib/models/Rutina';

interface ImportarRutinaDia2Props {
    onCrearEjercicio: (ejercicio: Ejercicio) => Promise<void>;
    onCrearRutina: (rutina: Rutina) => Promise<void>;
}

const ImportarRutinaDia2: React.FC<ImportarRutinaDia2Props> = ({
    onCrearEjercicio,
    onCrearRutina
}) => {
    const [guardando, setGuardando] = useState(false);
    const [progreso, setProgreso] = useState<string[]>([]);
    const [completado, setCompletado] = useState(false);

    const ejerciciosData: Omit<Ejercicio, 'id'>[] = [
        {
            nombre: 'MOVILIDAD DE ISQUIOTIBIALES',
            series: 3,
            repeticiones: [5, 5, 5],
            pesos: [0, 0, 0]
        },
        {
            nombre: 'MOVILIDAD DE HOMBROS EN ROTACION CON BASTON',
            series: 3,
            repeticiones: [5, 5, 5],
            pesos: [0, 0, 0]
        },
        {
            nombre: 'CARPA DINAMICA',
            series: 3,
            repeticiones: [6, 6, 6],
            pesos: [0, 0, 0]
        },
        {
            nombre: 'PESO MUERTO CONVENCIONAL',
            series: 4,
            repeticiones: [5, 4, 3, 2],
            pesos: [105, 110, 117, 140]
        },
        {
            nombre: 'PULL UPS',
            series: 4,
            repeticiones: [4, 5, 6, 0],
            pesos: [0, 0, 0, 0]
        },
        {
            nombre: 'PUENTE GLUTEO CON PASOS (ISQUIOTIBIALES)',
            series: 4,
            repeticiones: [8, 8, 8, 8],
            pesos: [0, 0, 0, 0]
        },
        {
            nombre: 'PESO MUERTO UNIPODAL',
            series: 4,
            repeticiones: [5, 6, 7, 8],
            pesos: [10, 12, 12, 16]
        }
    ];

    const handleImportar = async () => {
        setGuardando(true);
        setProgreso([]);
        setCompletado(false);

        const ejerciciosCreados: Ejercicio[] = [];

        try {
            // Crear cada ejercicio
            for (let i = 0; i < ejerciciosData.length; i++) {
                const ejercicioData = ejerciciosData[i];
                setProgreso(prev => [...prev, `Creando ejercicio ${i + 1}/${ejerciciosData.length}: ${ejercicioData.nombre}...`]);

                const ejercicioConId: Ejercicio = {
                    id: crypto.randomUUID(),
                    ...ejercicioData
                };

                await onCrearEjercicio(ejercicioConId);
                ejerciciosCreados.push(ejercicioConId);

                setProgreso(prev => [...prev, `✓ Ejercicio creado: ${ejercicioData.nombre}`]);
            }

            // Crear la rutina
            setProgreso(prev => [...prev, '\nCreando rutina DÍA 2...']);

            const rutina: Rutina = {
                id: crypto.randomUUID(),
                nombre: 'DÍA 2',
                descripcion: 'Calentamiento x3 vueltas + Trabajo Principal (Peso Muerto Convencional, Pull Ups, Puente Glúteo, Peso Muerto Unipodal)',
                ejerciciosIds: ejerciciosCreados.map(ej => ej.id),
                fechaCreacion: new Date().toISOString()
            };

            await onCrearRutina(rutina);
            setProgreso(prev => [...prev, `✓ Rutina creada: ${rutina.nombre} con ${rutina.ejerciciosIds.length} ejercicios`]);
            setProgreso(prev => [...prev, '\n🎉 ¡Importación completada exitosamente!']);
            setCompletado(true);

        } catch (error) {
            console.error('Error durante la importación:', error);
            setProgreso(prev => [...prev, `\n❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div style={{
            padding: '2rem',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            border: '2px solid var(--border)',
            marginBottom: '2rem'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--text)'
            }}>
                Importar Rutina: DÍA 2
            </h2>

            <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--bg)',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                    Esta acción creará:
                </h3>
                <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                    <li><strong>3 ejercicios de calentamiento</strong> (Movilidad de isquiotibiales, Movilidad de hombros, Carpa dinámica)</li>
                    <li><strong>4 ejercicios principales</strong> (Peso muerto convencional, Pull ups, Puente glúteo, Peso muerto unipodal)</li>
                    <li><strong>1 rutina</strong> llamada "DÍA 2" con todos los ejercicios</li>
                </ul>
            </div>

            {ejerciciosData.map((ej, index) => (
                <div key={index} style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {index + 1}. {ej.nombre}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {ej.series} series • Reps: [{ej.repeticiones.join(', ')}] • Pesos: [{ej.pesos.join(', ')}] kg
                    </div>
                </div>
            ))}

            {progreso.length > 0 && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                        Progreso:
                    </h3>
                    {progreso.map((msg, idx) => (
                        <div key={idx} style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={handleImportar}
                    disabled={guardando || completado}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        backgroundColor: completado ? 'var(--success)' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: guardando || completado ? 'not-allowed' : 'pointer',
                        opacity: guardando || completado ? 0.6 : 1
                    }}
                >
                    {guardando ? 'Guardando...' : completado ? '✓ Completado' : 'Guardar Todo'}
                </button>

                {completado && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--success)',
                        color: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '600'
                    }}>
                        ¡Rutina importada exitosamente! Podés ir a la pestaña "Rutinas" o "Ejercicios" para verla.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportarRutinaDia2;
