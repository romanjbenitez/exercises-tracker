'use client';

import React, { useState } from 'react';
import type { Rutina } from '@/lib/models/Rutina';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import RutinaForm from './RutinaForm';

interface RutinasListProps {
    rutinas: Rutina[];
    ejercicios: Ejercicio[];
    onCrear: (rutina: Rutina) => Promise<void>;
    onActualizar: (id: string, rutina: Partial<Rutina>) => Promise<void>;
    onEliminar: (id: string) => Promise<void>;
}

const RutinasList: React.FC<RutinasListProps> = ({
    rutinas,
    ejercicios,
    onCrear,
    onActualizar,
    onEliminar
}) => {
    const [mostrarForm, setMostrarForm] = useState(false);
    const [rutinaEditando, setRutinaEditando] = useState<Rutina | undefined>(undefined);

    const handleGuardar = (rutina: Rutina) => {
        if (rutinaEditando) {
            onActualizar(rutina.id, rutina);
        } else {
            onCrear(rutina);
        }
        setMostrarForm(false);
        setRutinaEditando(undefined);
    };

    const handleEditar = (rutina: Rutina) => {
        setRutinaEditando(rutina);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setRutinaEditando(undefined);
    };

    const handleNuevo = () => {
        setRutinaEditando(undefined);
        setMostrarForm(true);
    };

    const getEjercicioNombre = (id: string): string => {
        const ejercicio = ejercicios.find(ej => ej.id === id);
        return ejercicio ? ejercicio.nombre : 'Ejercicio no encontrado';
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2>Gestión de Rutinas</h2>
                {!mostrarForm && (
                    <button onClick={handleNuevo} style={{ padding: '10px 20px', fontSize: '16px' }}>
                        + Nueva Rutina
                    </button>
                )}
            </div>

            {mostrarForm && (
                <RutinaForm
                    rutinaInicial={rutinaEditando}
                    ejerciciosDisponibles={ejercicios}
                    onGuardar={handleGuardar}
                    onCancelar={handleCancelar}
                />
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Rutinas guardadas ({rutinas.length})</h3>
                {rutinas.length === 0 ? (
                    <p>No hay rutinas. Crea una nueva para empezar.</p>
                ) : (
                    rutinas.map((rutina) => (
                        <div
                            key={rutina.id}
                            style={{
                                marginBottom: '20px',
                                border: '1px solid #ddd',
                                padding: '15px',
                                borderRadius: '5px'
                            }}
                        >
                            <h4>{rutina.nombre}</h4>
                            {rutina.descripcion && (
                                <p style={{ color: '#666', marginBottom: '10px' }}>{rutina.descripcion}</p>
                            )}
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Ejercicios ({rutina.ejerciciosIds.length}):</strong>
                                {rutina.ejerciciosIds.length === 0 ? (
                                    <p style={{ marginLeft: '10px', color: '#999' }}>Sin ejercicios asignados</p>
                                ) : (
                                    <ul style={{ marginLeft: '20px' }}>
                                        {rutina.ejerciciosIds.map(ejId => (
                                            <li key={ejId}>{getEjercicioNombre(ejId)}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                                Creada: {new Date(rutina.fechaCreacion).toLocaleDateString()}
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEditar(rutina)}
                                    style={{ marginRight: '10px', padding: '5px 10px' }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`¿Eliminar rutina "${rutina.nombre}"?`)) {
                                            onEliminar(rutina.id);
                                        }
                                    }}
                                    style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RutinasList;
