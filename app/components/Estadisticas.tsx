'use client';

import React, { useState, useMemo } from 'react';
import type { Entrenamiento } from '@/lib/models/Entrenamiento';
import type { Ejercicio } from '@/lib/models/Ejercicio';

interface EstadisticasProps {
    entrenamientos: Entrenamiento[];
    ejercicios: Ejercicio[];
}

interface ProgresoEjercicio {
    ejercicioId: string;
    ejercicioNombre: string;
    registros: {
        fecha: string;
        semana: number;
        pesoMaximo: number;
        repeticionesMaximas: number;
        volumenTotal: number;
    }[];
}

const Estadisticas: React.FC<EstadisticasProps> = ({ entrenamientos }) => {
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<string>('');

    // Calcular progreso por ejercicio
    const progresoEjercicios = useMemo((): ProgresoEjercicio[] => {
        const ejerciciosConDatos: { [key: string]: ProgresoEjercicio } = {};

        entrenamientos.forEach(entrenamiento => {
            entrenamiento.ejercicios.forEach(ejercicioComp => {
                if (!ejerciciosConDatos[ejercicioComp.ejercicioId]) {
                    ejerciciosConDatos[ejercicioComp.ejercicioId] = {
                        ejercicioId: ejercicioComp.ejercicioId,
                        ejercicioNombre: ejercicioComp.ejercicioNombre,
                        registros: []
                    };
                }

                const pesoMaximo = Math.max(...ejercicioComp.series.map(s => s.peso));
                const repeticionesMaximas = Math.max(...ejercicioComp.series.map(s => s.repeticiones));
                const volumenTotal = ejercicioComp.series.reduce((sum, s) => sum + (s.peso * s.repeticiones), 0);

                ejerciciosConDatos[ejercicioComp.ejercicioId].registros.push({
                    fecha: entrenamiento.fecha,
                    semana: entrenamiento.semana,
                    pesoMaximo,
                    repeticionesMaximas,
                    volumenTotal
                });
            });
        });

        // Ordenar registros por fecha
        Object.values(ejerciciosConDatos).forEach(ejercicio => {
            ejercicio.registros.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        });

        return Object.values(ejerciciosConDatos);
    }, [entrenamientos]);

    const ejercicioActual = progresoEjercicios.find(e => e.ejercicioId === ejercicioSeleccionado);

    const calcularProgreso = (registros: ProgresoEjercicio['registros']) => {
        if (registros.length < 2) return null;

        const primero = registros[0];
        const ultimo = registros[registros.length - 1];

        const incrementoPeso = ultimo.pesoMaximo - primero.pesoMaximo;
        const porcentajePeso = primero.pesoMaximo > 0
            ? parseFloat(((incrementoPeso / primero.pesoMaximo) * 100).toFixed(1))
            : 0;

        const incrementoVolumen = ultimo.volumenTotal - primero.volumenTotal;
        const porcentajeVolumen = primero.volumenTotal > 0
            ? parseFloat(((incrementoVolumen / primero.volumenTotal) * 100).toFixed(1))
            : 0;

        return {
            incrementoPeso,
            porcentajePeso,
            incrementoVolumen,
            porcentajeVolumen,
            sesiones: registros.length,
            semanaInicial: primero.semana,
            semanaFinal: ultimo.semana
        };
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Estadísticas y Progreso</h2>

            {progresoEjercicios.length === 0 ? (
                <p style={{ color: '#666' }}>
                    No hay datos suficientes aún. Completa algunos entrenamientos para ver tu progreso.
                </p>
            ) : (
                <>
                    <div style={{ marginBottom: '30px' }}>
                        <h3>Resumen General</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{entrenamientos.length}</div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Entrenamientos Totales</div>
                            </div>
                            <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{progresoEjercicios.length}</div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Ejercicios Entrenados</div>
                            </div>
                            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '5px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    {Math.max(...entrenamientos.map(e => e.semana))}
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Semanas Completadas</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3>Progreso por Ejercicio</h3>
                        <label style={{ display: 'block', marginBottom: '10px' }}>
                            Selecciona un ejercicio:
                        </label>
                        <select
                            value={ejercicioSeleccionado}
                            onChange={(e) => setEjercicioSeleccionado(e.target.value)}
                            style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                        >
                            <option value="">-- Selecciona un ejercicio --</option>
                            {progresoEjercicios.map(ejercicio => (
                                <option key={ejercicio.ejercicioId} value={ejercicio.ejercicioId}>
                                    {ejercicio.ejercicioNombre} ({ejercicio.registros.length} sesiones)
                                </option>
                            ))}
                        </select>
                    </div>

                    {ejercicioActual && (
                        <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '20px' }}>
                            <h3>{ejercicioActual.ejercicioNombre}</h3>

                            {(() => {
                                const progreso = calcularProgreso(ejercicioActual.registros);
                                return progreso && (
                                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                                        <h4>Progreso Total</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div>
                                                <strong>Peso Máximo:</strong>
                                                <div style={{ fontSize: '20px', color: progreso.incrementoPeso >= 0 ? '#4CAF50' : '#f44336' }}>
                                                    {progreso.incrementoPeso >= 0 ? '+' : ''}{progreso.incrementoPeso} kg
                                                    ({progreso.porcentajePeso >= 0 ? '+' : ''}{progreso.porcentajePeso}%)
                                                </div>
                                            </div>
                                            <div>
                                                <strong>Volumen Total:</strong>
                                                <div style={{ fontSize: '20px', color: progreso.incrementoVolumen >= 0 ? '#4CAF50' : '#f44336' }}>
                                                    {progreso.incrementoVolumen >= 0 ? '+' : ''}{progreso.incrementoVolumen.toFixed(0)} kg
                                                    ({progreso.porcentajeVolumen >= 0 ? '+' : ''}{progreso.porcentajeVolumen}%)
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                            {progreso.sesiones} sesiones (Semana {progreso.semanaInicial} → Semana {progreso.semanaFinal})
                                        </div>
                                    </div>
                                );
                            })()}

                            <h4>Historial de Progreso</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fecha</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Semana</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Peso Máximo (kg)</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reps Máximas</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Volumen Total (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ejercicioActual.registros.map((registro, index) => {
                                        const registroAnterior = index > 0 ? ejercicioActual.registros[index - 1] : null;
                                        const mejoroPeso = registroAnterior && registro.pesoMaximo > registroAnterior.pesoMaximo;
                                        const mejoroVolumen = registroAnterior && registro.volumenTotal > registroAnterior.volumenTotal;

                                        return (
                                            <tr key={index}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {new Date(registro.fecha).toLocaleDateString('es-ES')}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                    {registro.semana}
                                                </td>
                                                <td style={{
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    textAlign: 'center',
                                                    backgroundColor: mejoroPeso ? '#c8e6c9' : 'transparent'
                                                }}>
                                                    {registro.pesoMaximo}
                                                    {mejoroPeso && ' 🔥'}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                    {registro.repeticionesMaximas}
                                                </td>
                                                <td style={{
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    textAlign: 'center',
                                                    backgroundColor: mejoroVolumen ? '#c8e6c9' : 'transparent'
                                                }}>
                                                    {registro.volumenTotal.toFixed(0)}
                                                    {mejoroVolumen && ' 🔥'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Estadisticas;
