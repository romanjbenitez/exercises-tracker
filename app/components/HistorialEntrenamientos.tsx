'use client';

import React, { useState } from 'react';
import type { Entrenamiento } from '@/lib/models/Entrenamiento';

interface HistorialEntrenamientosProps {
    entrenamientos: Entrenamiento[];
    onEliminar: (id: string) => Promise<void>;
}

const HistorialEntrenamientos: React.FC<HistorialEntrenamientosProps> = ({
    entrenamientos,
    onEliminar
}) => {
    const [filtroSemana, setFiltroSemana] = useState<number | 'todas'>('todas');
    const [entrenamientoExpandido, setEntrenamientoExpandido] = useState<string | null>(null);

    // Obtener semanas únicas
    const semanasUnicas = Array.from(new Set(entrenamientos.map(e => e.semana))).sort((a, b) => b - a);

    // Filtrar entrenamientos
    const entrenamientosFiltrados = filtroSemana === 'todas'
        ? entrenamientos
        : entrenamientos.filter(e => e.semana === filtroSemana);

    // Ordenar por fecha (más recientes primero)
    const entrenamientosOrdenados = [...entrenamientosFiltrados].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    const toggleEntrenamiento = (id: string) => {
        setEntrenamientoExpandido(entrenamientoExpandido === id ? null : id);
    };

    const formatearFecha = (fechaISO: string): string => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Historial de Entrenamientos</h2>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>Filtrar por semana:</label>
                <select
                    value={filtroSemana}
                    onChange={(e) => setFiltroSemana(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
                    style={{ padding: '8px', fontSize: '14px' }}
                >
                    <option value="todas">Todas las semanas</option>
                    {semanasUnicas.map(semana => (
                        <option key={semana} value={semana}>Semana {semana}</option>
                    ))}
                </select>
                <span style={{ marginLeft: '20px', color: '#666' }}>
                    Total: {entrenamientosOrdenados.length} entrenamientos
                </span>
            </div>

            {entrenamientosOrdenados.length === 0 ? (
                <p style={{ color: '#666' }}>No hay entrenamientos registrados aún.</p>
            ) : (
                <div>
                    {entrenamientosOrdenados.map(entrenamiento => (
                        <div
                            key={entrenamiento.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                onClick={() => toggleEntrenamiento(entrenamiento.id)}
                                style={{
                                    padding: '15px',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{entrenamiento.rutinaNombre}</h3>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                                        {formatearFecha(entrenamiento.fecha)} | Semana {entrenamiento.semana}
                                    </p>
                                </div>
                                <span style={{ fontSize: '20px' }}>
                                    {entrenamientoExpandido === entrenamiento.id ? '▼' : '▶'}
                                </span>
                            </div>

                            {entrenamientoExpandido === entrenamiento.id && (
                                <div style={{ padding: '15px', backgroundColor: 'white' }}>
                                    {entrenamiento.ejercicios.map((ejercicio, ejIndex) => (
                                        <div key={ejIndex} style={{ marginBottom: '20px' }}>
                                            <h4 style={{ marginBottom: '10px' }}>{ejercicio.ejercicioNombre}</h4>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                                                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Serie</th>
                                                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Repeticiones</th>
                                                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Peso (Kg)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ejercicio.series.map((serie, serieIndex) => (
                                                        <tr key={serieIndex}>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                                {serieIndex + 1}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                                {serie.repeticiones}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                                {serie.peso}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}

                                    {entrenamiento.notas && (
                                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fffbea', borderRadius: '3px' }}>
                                            <strong>Notas:</strong>
                                            <p style={{ margin: '5px 0 0 0' }}>{entrenamiento.notas}</p>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '15px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => {
                                                if (confirm('¿Eliminar este entrenamiento?')) {
                                                    onEliminar(entrenamiento.id);
                                                }
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialEntrenamientos;
