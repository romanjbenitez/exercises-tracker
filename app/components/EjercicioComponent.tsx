'use client';

import React from "react";
import type { Ejercicio } from "@/lib/models/Ejercicio";


const EjercicioComponent: React.FC<Ejercicio> = ({ series, nombre, repeticiones, pesos }) => {
    return (
        <div className="card-table">
            <div className="card-table__title">{nombre}</div>
            <div className="card-table__data">
                <div className="card-table__left">
                    <div className="card-table__item">Serie</div>
                    {Array.from({ length: series }).map((_, i) => (
                        <div key={`serie-${i}`} className="card-table__item">
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div className="card-table__right">
                    <div className="card-table__item">Reps / Peso</div>
                    {Array.from({ length: series }).map((_, i) => (
                        <div key={`data-${i}`} className="card-table__item">
                            {repeticiones[i]} × {pesos[i]}kg
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EjercicioComponent;