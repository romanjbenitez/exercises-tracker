'use client';

import React, { useState, useEffect } from 'react';
import type { Rutina } from '@/lib/models/Rutina';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import type { Entrenamiento, EjercicioCompletado, SerieCompletada } from '@/lib/models/Entrenamiento';
import { crearEntrenamiento } from '@/lib/models/Entrenamiento';

interface EntrenamientoActivoProps {
    rutinas: Rutina[];
    ejercicios: Ejercicio[];
    onGuardar: (entrenamiento: Entrenamiento) => Promise<Entrenamiento>;
}

const EntrenamientoActivo: React.FC<EntrenamientoActivoProps> = ({
    rutinas,
    ejercicios,
    onGuardar
}) => {
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState<Rutina | null>(null);
    const [semana, setSemana] = useState(1);
    const [ejerciciosCompletados, setEjerciciosCompletados] = useState<EjercicioCompletado[]>([]);
    const [ejercicioActualIndex, setEjercicioActualIndex] = useState(0);
    const [notas, setNotas] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Inicializar ejercicios cuando se selecciona una rutina
    useEffect(() => {
        if (rutinaSeleccionada) {
            const ejerciciosIniciales: EjercicioCompletado[] = rutinaSeleccionada.ejerciciosIds.map(ejId => {
                const ejercicio = ejercicios.find(e => e.id === ejId);
                if (!ejercicio) {
                    return {
                        ejercicioId: ejId,
                        ejercicioNombre: 'Ejercicio no encontrado',
                        series: []
                    };
                }

                const series: SerieCompletada[] = Array(ejercicio.series).fill(null).map(() => ({
                    repeticiones: 0,
                    peso: 0
                }));

                return {
                    ejercicioId: ejercicio.id,
                    ejercicioNombre: ejercicio.nombre,
                    series
                };
            });
            setEjerciciosCompletados(ejerciciosIniciales);
        }
    }, [rutinaSeleccionada, ejercicios]);

    const handleRutinaChange = (rutinaId: string) => {
        const rutina = rutinas.find(r => r.id === rutinaId);
        setRutinaSeleccionada(rutina || null);
    };

    const handleSerieChange = (ejercicioIndex: number, serieIndex: number, campo: 'repeticiones' | 'peso', valor: string) => {
        setEjerciciosCompletados(prev => {
            const nuevos = [...prev];
            const valorNumerico = campo === 'peso' ? parseFloat(valor) || 0 : parseInt(valor) || 0;
            nuevos[ejercicioIndex].series[serieIndex][campo] = valorNumerico;
            return nuevos;
        });
    };

    const handleGuardar = async () => {
        if (!rutinaSeleccionada) return;

        setGuardando(true);
        try {
            const entrenamiento = crearEntrenamiento(
                rutinaSeleccionada.id,
                rutinaSeleccionada.nombre,
                semana
            );
            entrenamiento.ejercicios = ejerciciosCompletados;
            entrenamiento.notas = notas;

            await onGuardar(entrenamiento);

            // Limpiar formulario
            setRutinaSeleccionada(null);
            setEjerciciosCompletados([]);
            setNotas('');
            alert('¡Entrenamiento guardado exitosamente!');
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar el entrenamiento');
        } finally {
            setGuardando(false);
        }
    };

    if (!rutinaSeleccionada) {
        return (
            <div style={{ padding: '1rem' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: 'var(--text)'
                }}>
                    Iniciar Entrenamiento
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-secondary)'
                    }}>
                        Rutina
                    </label>
                    <select
                        onChange={(e) => handleRutinaChange(e.target.value)}
                        style={{
                            padding: '1rem',
                            fontSize: '1rem',
                            width: '100%',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px'
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona una rutina</option>
                        {rutinas.map(rutina => (
                            <option key={rutina.id} value={rutina.id}>
                                {rutina.nombre} • {rutina.ejerciciosIds.length} ejercicios
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-secondary)'
                    }}>
                        Semana
                    </label>
                    <input
                        type="number"
                        value={semana}
                        onChange={(e) => setSemana(parseInt(e.target.value) || 1)}
                        min="1"
                        style={{
                            padding: '1rem',
                            fontSize: '1rem',
                            width: '100%',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px'
                        }}
                    />
                </div>
            </div>
        );
    }

    const ejercicioActual = ejerciciosCompletados[ejercicioActualIndex];
    const ejercicioOriginal = ejercicios.find(e => e.id === ejercicioActual?.ejercicioId);
    const totalEjercicios = ejerciciosCompletados.length;

    return (
        <div style={{ height: 'calc(100vh - 60px - 80px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header con info de rutina y progreso */}
            <div style={{
                padding: '1rem',
                backgroundColor: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: '60px',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                        {rutinaSeleccionada.nombre}
                    </h2>
                    <button
                        onClick={() => {
                            if (confirm('¿Salir sin guardar?')) {
                                setRutinaSeleccionada(null);
                                setEjercicioActualIndex(0);
                            }
                        }}
                        style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                        }}
                    >
                        Salir
                    </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Semana {semana} • Ejercicio {ejercicioActualIndex + 1} de {totalEjercicios}
                </p>
                {/* Barra de progreso */}
                <div style={{
                    marginTop: '0.75rem',
                    height: '4px',
                    backgroundColor: 'var(--border)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${((ejercicioActualIndex + 1) / totalEjercicios) * 100}%`,
                        backgroundColor: 'var(--primary)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Ejercicio actual */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                {ejercicioActual && (
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: 'var(--text)'
                        }}>
                            {ejercicioActual.ejercicioNombre}
                        </h3>

                        {/* Series */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {ejercicioActual.series.map((serie, serieIndex) => (
                                <div
                                    key={serieIndex}
                                    style={{
                                        backgroundColor: 'var(--surface)',
                                        border: '2px solid var(--border)',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'var(--text)'
                                        }}>
                                            Serie {serieIndex + 1}
                                        </span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            Objetivo: {ejercicioOriginal?.repeticiones[serieIndex] || '-'} reps × {ejercicioOriginal?.pesos[serieIndex] || '-'} kg
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Repeticiones
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={serie.repeticiones || ''}
                                                onChange={(e) => handleSerieChange(ejercicioActualIndex, serieIndex, 'repeticiones', e.target.value)}
                                                min="0"
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    fontSize: '1.5rem',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    backgroundColor: 'var(--bg)',
                                                    color: 'var(--text)',
                                                    border: '2px solid var(--border)',
                                                    borderRadius: '12px'
                                                }}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Peso (kg)
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                step="0.5"
                                                value={serie.peso || ''}
                                                onChange={(e) => handleSerieChange(ejercicioActualIndex, serieIndex, 'peso', e.target.value)}
                                                min="0"
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    fontSize: '1.5rem',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    backgroundColor: 'var(--bg)',
                                                    color: 'var(--text)',
                                                    border: '2px solid var(--border)',
                                                    borderRadius: '12px'
                                                }}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer con navegación */}
            <div style={{
                padding: '1rem',
                backgroundColor: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '0.75rem'
            }}>
                {ejercicioActualIndex > 0 && (
                    <button
                        onClick={() => setEjercicioActualIndex(prev => prev - 1)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--bg)',
                            color: 'var(--text)',
                            border: '2px solid var(--border)',
                            borderRadius: '12px'
                        }}
                    >
                        ← Anterior
                    </button>
                )}

                {ejercicioActualIndex < totalEjercicios - 1 ? (
                    <button
                        onClick={() => setEjercicioActualIndex(prev => prev + 1)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            borderRadius: '12px'
                        }}
                    >
                        Siguiente →
                    </button>
                ) : (
                    <button
                        onClick={handleGuardar}
                        disabled={guardando}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--success)',
                            color: 'white',
                            borderRadius: '12px',
                            opacity: guardando ? 0.6 : 1,
                            cursor: guardando ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {guardando ? 'Guardando...' : '✓ Finalizar'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EntrenamientoActivo;
