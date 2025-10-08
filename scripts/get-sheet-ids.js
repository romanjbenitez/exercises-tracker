// Script para obtener los IDs de las pestañas de Google Sheets
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno manualmente
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      let value = valueParts.join('=').trim();
      // Remover comillas si existen
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key.trim()] = value;
    }
  });

  return env;
}

async function getSheetIds() {
  try {
    const env = loadEnv();

    // Configurar autenticación
    const auth = new google.auth.JWT({
      email: env.GOOGLE_CLIENT_EMAIL,
      key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const SHEET_ID = env.GOOGLE_SHEET_ID;

    // Obtener información del spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    console.log('\n📊 IDs de las pestañas de tu Google Sheet:\n');
    console.log('═══════════════════════════════════════════\n');

    response.data.sheets.forEach((sheet) => {
      const title = sheet.properties.title;
      const sheetId = sheet.properties.sheetId;
      const index = sheet.properties.index;

      console.log(`📄 Pestaña: "${title}"`);
      console.log(`   └─ ID: ${sheetId}`);
      console.log(`   └─ Index: ${index}\n`);
    });

    console.log('═══════════════════════════════════════════\n');
    console.log('✅ Copia estos IDs y actualiza google-sheets.ts');
    console.log('   - Ejercicios: busca "sheetId: 0" y cámbialo');
    console.log('   - Rutinas: busca "sheetId: 1" y cámbialo');
    console.log('   - Entrenamientos: busca "sheetId: 2" y cámbialo\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getSheetIds();
