'use client';

import React, { useState } from 'react';
import type { Rutina } from '@/lib/models/Rutina';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import { crearRutina } from '@/lib/models/Rutina';

interface RutinaFormProps {
    rutinaInicial?: Rutina;
    ejerciciosDisponibles: Ejercicio[];
    onGuardar: (rutina: Rutina) => void;
    onCancelar: () => void;
}

const RutinaForm: React.FC<RutinaFormProps> = ({
    rutinaInicial,
    ejerciciosDisponibles,
    onGuardar,
    onCancelar
}) => {
    const [nombre, setNombre] = useState(rutinaInicial?.nombre || '');
    const [descripcion, setDescripcion] = useState(rutinaInicial?.descripcion || '');
    const [ejerciciosIds, setEjerciciosIds] = useState<string[]>(rutinaInicial?.ejerciciosIds || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const rutina: Rutina = rutinaInicial
            ? { ...rutinaInicial, nombre, descripcion, ejerciciosIds }
            : { ...crearRutina(nombre, descripcion), ejerciciosIds };

        onGuardar(rutina);
    };

    const toggleEjercicio = (ejercicioId: string) => {
        if (ejerciciosIds.includes(ejercicioId)) {
            setEjerciciosIds(ejerciciosIds.filter(id => id !== ejercicioId));
        } else {
            setEjerciciosIds([...ejerciciosIds, ejercicioId]);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h3>{rutinaInicial ? 'Editar Rutina' : 'Nueva Rutina'}</h3>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>
                    Descripción:
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px', width: '300px', height: '60px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4>Ejercicios:</h4>
                {ejerciciosDisponibles.length === 0 ? (
                    <p style={{ color: '#666' }}>No hay ejercicios disponibles. Crea ejercicios primero.</p>
                ) : (
                    ejerciciosDisponibles.map(ejercicio => (
                        <div key={ejercicio.id} style={{ marginBottom: '5px' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={ejerciciosIds.includes(ejercicio.id)}
                                    onChange={() => toggleEjercicio(ejercicio.id)}
                                    style={{ marginRight: '8px' }}
                                />
                                {ejercicio.nombre} ({ejercicio.series} series)
                            </label>
                        </div>
                    ))
                )}
            </div>

            <div>
                <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>
                    Guardar
                </button>
                <button type="button" onClick={onCancelar} style={{ padding: '8px 16px' }}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default RutinaForm;
