'use client';

import React from "react";
import type { Ejercicio } from "@/lib/models/Ejercicio";


const EjercicioComponent: React.FC<Ejercicio> = ({ series, nombre, repeticiones, pesos }) => {
    return (
        <table className="modern-table">
            <thead>
                <tr>
                    <th>{nombre}</th>
                    <th>Repeticiones</th>
                    <th>Peso</th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: series }).map((_, i) => (
                    <tr key={i}>
                        <td data-label="Serie">{i + 1}</td>
                        <td data-label="Repeticiones">{repeticiones[i]}</td>
                        <td data-label="Peso (kg)">{pesos[i]}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EjercicioComponent;