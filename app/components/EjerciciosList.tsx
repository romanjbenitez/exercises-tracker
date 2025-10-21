'use client';

import React, { useState, useRef } from 'react';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import EjercicioComponent from './EjercicioComponent';
import EjercicioForm from './EjercicioForm';

interface EjerciciosListProps {
    ejercicios: Ejercicio[];
    onCrear: (ejercicio: Ejercicio) => Promise<void>;
    onActualizar: (id: string, ejercicio: Partial<Ejercicio>) => Promise<void>;
    onEliminar: (id: string) => Promise<void>;
}

const EjerciciosList: React.FC<EjerciciosListProps> = ({
    ejercicios,
    onCrear,
    onActualizar,
    onEliminar
}) => {
    const [mostrarForm, setMostrarForm] = useState(false);
    const [ejercicioEditando, setEjercicioEditando] = useState<Ejercicio | undefined>(undefined);
    const formRef = useRef<HTMLDivElement>(null);

    const handleGuardar = (ejercicio: Ejercicio) => {
        if (ejercicioEditando) {
            onActualizar(ejercicio.id, ejercicio);
        } else {
            onCrear(ejercicio);
        }
        setMostrarForm(false);
        setEjercicioEditando(undefined);
    };

    const handleEditar = (ejercicio: Ejercicio) => {
        setEjercicioEditando(ejercicio);
        setMostrarForm(true);
        // Scroll al formulario después de un pequeño delay para que se renderice
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setEjercicioEditando(undefined);
    };

    const handleNuevo = () => {
        setEjercicioEditando(undefined);
        setMostrarForm(true);
        // Scroll al formulario después de un pequeño delay para que se renderice
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2>Gestión de Ejercicios</h2>
                <button onClick={handleNuevo} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    + Nuevo Ejercicio
                </button>
            </div>

            {/* Formulario para nuevo ejercicio (sin ejercicioEditando) */}
            {mostrarForm && !ejercicioEditando && (
                <div ref={formRef} style={{ marginBottom: '20px' }}>
                    <EjercicioForm
                        ejercicioInicial={ejercicioEditando}
                        onGuardar={handleGuardar}
                        onCancelar={handleCancelar}
                    />
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Ejercicios guardados ({ejercicios.length})</h3>
                {ejercicios.length === 0 ? (
                    <p>No hay ejercicios. Crea uno nuevo para empezar.</p>
                ) : (
                    ejercicios.map((ejercicio) => (
                        <div key={ejercicio.id} style={{ marginBottom: '20px' }}>
                            {/* Formulario de edición justo arriba de la tarjeta */}
                            {mostrarForm && ejercicioEditando?.id === ejercicio.id && (
                                <div ref={formRef} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', border: '2px solid var(--primary)', borderRadius: '8px' }}>
                                    <EjercicioForm
                                        ejercicioInicial={ejercicioEditando}
                                        onGuardar={handleGuardar}
                                        onCancelar={handleCancelar}
                                    />
                                </div>
                            )}

                            <div style={{ border: '1px solid #ddd', padding: '10px' }}>
                                <EjercicioComponent
                                    id={ejercicio.id}
                                    nombre={ejercicio.nombre}
                                    series={ejercicio.series}
                                    repeticiones={ejercicio.repeticiones}
                                    pesos={ejercicio.pesos}
                                />
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleEditar(ejercicio)}
                                        style={{ marginRight: '10px', padding: '5px 10px' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`¿Eliminar "${ejercicio.nombre}"?`)) {
                                                onEliminar(ejercicio.id);
                                            }
                                        }}
                                        style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EjerciciosList;
