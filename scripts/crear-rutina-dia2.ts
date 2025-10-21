import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { createEjercicio, createRutina } from '../lib/google-sheets';
import type { Ejercicio } from '../lib/models/Ejercicio';
import type { Rutina } from '../lib/models/Rutina';

async function crearRutinaDia2() {
    console.log('Creando ejercicios para Día 2...\n');

    // Ejercicios de calentamiento
    const calentamientoEjercicios: Partial<Ejercicio>[] = [
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
        }
    ];

    // Ejercicios principales con datos de Semana 1
    const trabajoPrincipalEjercicios: Partial<Ejercicio>[] = [
        {
            nombre: 'PESO MUERTO CONVENCIONAL',
            series: 4,
            repeticiones: [5, 4, 3, 2],
            pesos: [105, 110, 117, 140] // Semana 1
        },
        {
            nombre: 'PULL UPS',
            series: 4,
            repeticiones: [4, 5, 6, 0], // M.E. = máximo esfuerzo (dejamos 0 para que lo complete)
            pesos: [0, 0, 0, 0] // Peso corporal
        },
        {
            nombre: 'PUENTE GLUTEO CON PASOS (ISQUIOTIBIALES)',
            series: 4,
            repeticiones: [8, 8, 8, 8],
            pesos: [0, 0, 0, 0] // Sin peso adicional
        },
        {
            nombre: 'PESO MUERTO UNIPODAL',
            series: 4,
            repeticiones: [5, 6, 7, 8],
            pesos: [10, 12, 12, 16] // Semana 1
        }
    ];

    const todosEjercicios = [...calentamientoEjercicios, ...trabajoPrincipalEjercicios];
    const ejerciciosCreados: Ejercicio[] = [];

    // Crear cada ejercicio
    for (const ej of todosEjercicios) {
        try {
            console.log(`Creando ejercicio: ${ej.nombre}...`);
            const ejercicioCreado = await createEjercicio(ej as Ejercicio);
            ejerciciosCreados.push(ejercicioCreado);
            console.log(`✓ Creado: ${ejercicioCreado.nombre} (ID: ${ejercicioCreado.id})`);
        } catch (error) {
            console.error(`✗ Error creando ${ej.nombre}:`, error);
        }
    }

    console.log(`\n${ejerciciosCreados.length} ejercicios creados exitosamente.\n`);

    // Crear la rutina "DÍA 2"
    console.log('Creando rutina DÍA 2...');

    const rutinaDia2: Partial<Rutina> = {
        nombre: 'DÍA 2',
        descripcion: 'Calentamiento x3 vueltas + Trabajo Principal (Peso Muerto Convencional, Pull Ups, Puente Glúteo, Peso Muerto Unipodal)',
        ejerciciosIds: ejerciciosCreados.map(ej => ej.id),
        fechaCreacion: new Date().toISOString()
    };

    try {
        const rutinaCreada = await createRutina(rutinaDia2 as Rutina);
        console.log(`✓ Rutina creada: ${rutinaCreada.nombre} (ID: ${rutinaCreada.id})`);
        console.log(`  - ${rutinaCreada.ejerciciosIds.length} ejercicios incluidos`);
        console.log('\n¡Rutina DÍA 2 creada exitosamente! 🎉');
    } catch (error) {
        console.error('✗ Error creando rutina:', error);
    }
}

// Ejecutar el script
crearRutinaDia2().catch(console.error);
