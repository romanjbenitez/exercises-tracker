import { google } from 'googleapis';
import type { Ejercicio } from './models/Ejercicio';
import type { Rutina } from './models/Rutina';
import type { Entrenamiento } from './models/Entrenamiento';

// Configurar autenticación usando JWT
const getAuthClient = () => {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const sheets = google.sheets({ version: 'v4', auth: getAuthClient() });
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// ============ EJERCICIOS ============

export async function getEjercicios(): Promise<Ejercicio[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Ejercicios!A2:E', // Desde fila 2 (skip headers)
  });

  const rows = response.data.values || [];
  return rows.map(row => ({
    id: row[0],
    nombre: row[1],
    series: parseInt(row[2]),
    repeticiones: JSON.parse(row[3] || '[]'),
    pesos: JSON.parse(row[4] || '[]'),
  }));
}

export async function getEjercicioById(id: string): Promise<Ejercicio | null> {
  const ejercicios = await getEjercicios();
  return ejercicios.find(e => e.id === id) || null;
}

export async function createEjercicio(ejercicio: Ejercicio): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Ejercicios!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        ejercicio.id,
        ejercicio.nombre,
        ejercicio.series,
        JSON.stringify(ejercicio.repeticiones),
        JSON.stringify(ejercicio.pesos),
      ]],
    },
  });
}

export async function updateEjercicio(id: string, data: Partial<Ejercicio>): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Ejercicios!A2:E',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Ejercicio not found');
  }

  const existingRow = rows[rowIndex];
  const updatedRow = [
    id,
    data.nombre ?? existingRow[1],
    data.series ?? parseInt(existingRow[2]),
    data.repeticiones ? JSON.stringify(data.repeticiones) : existingRow[3],
    data.pesos ? JSON.stringify(data.pesos) : existingRow[4],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Ejercicios!A${rowIndex + 2}:E${rowIndex + 2}`, // +2 porque empezamos en fila 2
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  });
}

export async function deleteEjercicio(id: string): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Ejercicios!A2:E',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Ejercicio not found');
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 0, // ID de la hoja Ejercicios (la primera hoja es 0)
            dimension: 'ROWS',
            startIndex: rowIndex + 1, // +1 porque fila 0 es el header
            endIndex: rowIndex + 2,
          }
        }
      }]
    }
  });
}

// ============ RUTINAS ============

export async function getRutinas(): Promise<Rutina[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Rutinas!A2:E',
  });

  const rows = response.data.values || [];
  return rows.map(row => ({
    id: row[0],
    nombre: row[1],
    descripcion: row[2] || undefined,
    ejerciciosIds: JSON.parse(row[3] || '[]'),
    fechaCreacion: row[4],
  }));
}

export async function getRutinaById(id: string): Promise<Rutina | null> {
  const rutinas = await getRutinas();
  return rutinas.find(r => r.id === id) || null;
}

export async function createRutina(rutina: Rutina): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Rutinas!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        rutina.id,
        rutina.nombre,
        rutina.descripcion || '',
        JSON.stringify(rutina.ejerciciosIds),
        rutina.fechaCreacion,
      ]],
    },
  });
}

export async function updateRutina(id: string, data: Partial<Rutina>): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Rutinas!A2:E',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Rutina not found');
  }

  const existingRow = rows[rowIndex];
  const updatedRow = [
    id,
    data.nombre ?? existingRow[1],
    data.descripcion !== undefined ? data.descripcion : (existingRow[2] || ''),
    data.ejerciciosIds ? JSON.stringify(data.ejerciciosIds) : existingRow[3],
    existingRow[4], // fecha creación no se modifica
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Rutinas!A${rowIndex + 2}:E${rowIndex + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  });
}

export async function deleteRutina(id: string): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Rutinas!A2:E',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Rutina not found');
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 1, // ID de la hoja Rutinas (segunda hoja es 1)
            dimension: 'ROWS',
            startIndex: rowIndex + 1,
            endIndex: rowIndex + 2,
          }
        }
      }]
    }
  });
}

// ============ ENTRENAMIENTOS ============

export async function getEntrenamientos(): Promise<Entrenamiento[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Entrenamientos!A2:G',
  });

  const rows = response.data.values || [];
  return rows.map(row => ({
    id: row[0],
    rutinaId: row[1],
    rutinaNombre: row[2],
    fecha: row[3],
    semana: parseInt(row[4]),
    ejercicios: JSON.parse(row[5] || '[]'),
    notas: row[6] || undefined,
  }));
}

export async function getEntrenamientoById(id: string): Promise<Entrenamiento | null> {
  const entrenamientos = await getEntrenamientos();
  return entrenamientos.find(e => e.id === id) || null;
}

export async function createEntrenamiento(entrenamiento: Entrenamiento): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Entrenamientos!A:G',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        entrenamiento.id,
        entrenamiento.rutinaId,
        entrenamiento.rutinaNombre,
        entrenamiento.fecha,
        entrenamiento.semana,
        JSON.stringify(entrenamiento.ejercicios),
        entrenamiento.notas || '',
      ]],
    },
  });
}

export async function updateEntrenamiento(id: string, data: Partial<Entrenamiento>): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Entrenamientos!A2:G',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Entrenamiento not found');
  }

  const existingRow = rows[rowIndex];
  const updatedRow = [
    id,
    data.rutinaId ?? existingRow[1],
    data.rutinaNombre ?? existingRow[2],
    data.fecha ?? existingRow[3],
    data.semana ?? parseInt(existingRow[4]),
    data.ejercicios ? JSON.stringify(data.ejercicios) : existingRow[5],
    data.notas !== undefined ? data.notas : (existingRow[6] || ''),
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Entrenamientos!A${rowIndex + 2}:G${rowIndex + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  });
}

export async function deleteEntrenamiento(id: string): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Entrenamientos!A2:G',
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === id);

  if (rowIndex === -1) {
    throw new Error('Entrenamiento not found');
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 2, // ID de la hoja Entrenamientos (tercera hoja es 2)
            dimension: 'ROWS',
            startIndex: rowIndex + 1,
            endIndex: rowIndex + 2,
          }
        }
      }]
    }
  });
}
