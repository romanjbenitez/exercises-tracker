'use client';

import React, { useState, useEffect } from 'react';
import type { Ejercicio } from '@/lib/models/Ejercicio';
import { crearEjercicio } from '@/lib/models/Ejercicio';

interface EjercicioFormProps {
    ejercicioInicial?: Ejercicio;
    onGuardar: (ejercicio: Ejercicio) => void;
    onCancelar: () => void;
}

const EjercicioForm: React.FC<EjercicioFormProps> = ({ ejercicioInicial, onGuardar, onCancelar }) => {
    const [nombre, setNombre] = useState(ejercicioInicial?.nombre || '');
    const [series, setSeries] = useState(ejercicioInicial?.series || 3);
    const [repeticiones, setRepeticiones] = useState<number[]>(
        ejercicioInicial?.repeticiones || Array(3).fill(0)
    );
    const [pesos, setPesos] = useState<number[]>(
        ejercicioInicial?.pesos || Array(3).fill(0)
    );

    useEffect(() => {
        if (series !== repeticiones.length) {
            setRepeticiones(Array(series).fill(0));
            setPesos(Array(series).fill(0));
        }
    }, [series, repeticiones.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ejercicio: Ejercicio = ejercicioInicial
            ? { ...ejercicioInicial, nombre, series, repeticiones, pesos }
            : { ...crearEjercicio(nombre, series), repeticiones, pesos };

        onGuardar(ejercicio);
    };

    const handleRepChange = (index: number, value: string) => {
        const newReps = [...repeticiones];
        newReps[index] = parseInt(value) || 0;
        setRepeticiones(newReps);
    };

    const handlePesoChange = (index: number, value: string) => {
        const newPesos = [...pesos];
        newPesos[index] = parseFloat(value) || 0;
        setPesos(newPesos);
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h3>{ejercicioInicial ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h3>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Series:
                    <input
                        type="number"
                        value={series}
                        onChange={(e) => setSeries(parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                        required
                        style={{ marginLeft: '10px', padding: '5px', width: '60px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <h4>Detalles por serie:</h4>
                {Array.from({ length: series }).map((_, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                        <span style={{ marginRight: '10px' }}>Serie {i + 1}:</span>
                        <label style={{ marginRight: '15px' }}>
                            Reps:
                            <input
                                type="number"
                                value={repeticiones[i] || 0}
                                onChange={(e) => handleRepChange(i, e.target.value)}
                                min="0"
                                style={{ marginLeft: '5px', padding: '5px', width: '60px' }}
                            />
                        </label>
                        <label>
                            Peso (kg):
                            <input
                                type="number"
                                step="0.5"
                                value={pesos[i] || 0}
                                onChange={(e) => handlePesoChange(i, e.target.value)}
                                min="0"
                                style={{ marginLeft: '5px', padding: '5px', width: '70px' }}
                            />
                        </label>
                    </div>
                ))}
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

export default EjercicioForm;
