# Gym Workout Tracker - Next.js App

Una aplicación completa para gestionar tus rutinas de gimnasio, registrar entrenamientos y visualizar tu progreso semana a semana.

## Características

- ✅ **CRUD de Ejercicios**: Crea, edita y elimina ejercicios personalizados
- ✅ **Gestión de Rutinas**: Organiza tus ejercicios en rutinas completas
- ✅ **Registro de Entrenamientos**: Anota pesos y repeticiones por serie cada semana
- ✅ **Historial Completo**: Revisa todos tus entrenamientos anteriores
- ✅ **Estadísticas de Progreso**: Visualiza tu evolución con métricas y gráficas
- ✅ **Persistencia con Google Sheets**: Tus datos se guardan automáticamente en Google Sheets

## Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19** con TypeScript
- **Google Sheets API** para persistencia de datos
- **TailwindCSS** ready (puedes agregarlo si lo deseas)

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Google Cloud Project

#### a) Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre de tu proyecto

#### b) Habilitar Google Sheets API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Sheets API"
3. Haz clic en **Enable**

#### c) Crear Service Account

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **Service Account**
3. Completa los datos:
   - **Service account name**: `gym-tracker-service` (o el nombre que prefieras)
   - **Service account ID**: se generará automáticamente
4. Haz clic en **Create and Continue**
5. En "Grant this service account access to project", puedes hacer clic en **Continue** sin seleccionar roles
6. Haz clic en **Done**

#### d) Generar Clave Privada

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña **Keys**
3. Haz clic en **Add Key** > **Create new key**
4. Selecciona **JSON** y haz clic en **Create**
5. Se descargará un archivo JSON con tus credenciales
6. **¡IMPORTANTE!** Guarda este archivo en un lugar seguro. Lo necesitarás en el siguiente paso.

### 3. Configurar Google Sheet

#### a) Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com/)
2. Crea una nueva hoja de cálculo
3. Nómbrala como prefieras (ej: "Gym Tracker Data")
4. Copia el **ID del Sheet** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```

#### b) Compartir Sheet con Service Account

1. En tu Google Sheet, haz clic en **Share** (Compartir)
2. Pega el email del Service Account (lo encuentras en el JSON descargado o en Google Cloud Console)
   - Ejemplo: `gym-tracker-service@your-project.iam.gserviceaccount.com`
3. Dale permisos de **Editor**
4. Desmarca "Notify people" y haz clic en **Share**

#### c) Crear Pestañas (Tabs) Requeridas

Tu Google Sheet debe tener exactamente estas 3 pestañas con estos nombres:

1. **Ejercicios** (con estas columnas en la primera fila):
   - `id` | `nombre` | `series` | `repeticiones` | `pesos`

2. **Rutinas** (con estas columnas en la primera fila):
   - `id` | `nombre` | `descripcion` | `ejerciciosIds` | `fechaCreacion`

3. **Entrenamientos** (con estas columnas en la primera fila):
   - `id` | `rutinaId` | `rutinaNombre` | `fecha` | `semana` | `ejercicios` | `notas`

**Ejemplo visual:**

```
Tab: Ejercicios
┌──────────┬──────────┬────────┬──────────────┬─────────┐
│ id       │ nombre   │ series │ repeticiones │ pesos   │
├──────────┼──────────┼────────┼──────────────┼─────────┤
│          │          │        │              │         │
└──────────┴──────────┴────────┴──────────────┴─────────┘

Tab: Rutinas
┌──────────┬──────────┬─────────────┬──────────────┬───────────────┐
│ id       │ nombre   │ descripcion │ ejerciciosIds│ fechaCreacion │
├──────────┼──────────┼─────────────┼──────────────┼───────────────┤
│          │          │             │              │               │
└──────────┴──────────┴─────────────┴──────────────┴───────────────┘

Tab: Entrenamientos
┌──────────┬──────────┬──────────────┬────────┬────────┬────────────┬────────┐
│ id       │ rutinaId │ rutinaNombre │ fecha  │ semana │ ejercicios │ notas  │
├──────────┼──────────┼──────────────┼────────┼────────┼────────────┼────────┤
│          │          │              │        │        │            │        │
└──────────┴──────────┴──────────────┴────────┴────────┴────────────┴────────┘
```

### 4. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Abre `.env.local` y completa los valores:

   ```env
   GOOGLE_SHEET_ID=tu_sheet_id_aqui
   GOOGLE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"
   ```

3. Para obtener estos valores del JSON descargado:
   - `GOOGLE_SHEET_ID`: El ID que copiaste de la URL del Sheet
   - `GOOGLE_CLIENT_EMAIL`: Busca `client_email` en el JSON
   - `GOOGLE_PRIVATE_KEY`: Busca `private_key` en el JSON (cópialo completo, incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`)

**⚠️ IMPORTANTE:**
- NO compartas el archivo `.env.local`
- NO subas este archivo a GitHub
- El archivo `.env.local` ya está incluido en `.gitignore`

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La app estará disponible en http://localhost:3000
```

## Uso de la Aplicación

### Gestionar Ejercicios

1. Ve a la pestaña **"Ejercicios"**
2. Haz clic en **"+ Nuevo Ejercicio"**
3. Completa:
   - Nombre del ejercicio
   - Número de series
   - Repeticiones y peso para cada serie
4. Haz clic en **"Guardar"**

### Crear Rutinas

1. Ve a la pestaña **"Rutinas"**
2. Haz clic en **"+ Nueva Rutina"**
3. Completa:
   - Nombre de la rutina
   - Descripción (opcional)
   - Selecciona los ejercicios que incluirá
4. Haz clic en **"Guardar"**

### Registrar Entrenamientos

1. Ve a la pestaña **"Entrenar"**
2. Selecciona la rutina del día
3. Ingresa el número de semana
4. Para cada ejercicio, anota:
   - Peso levantado en cada serie
   - Repeticiones completadas en cada serie
5. Agrega notas si lo deseas
6. Haz clic en **"Completar Entrenamiento"**

### Ver Historial

1. Ve a la pestaña **"Historial"**
2. Filtra por semana si lo deseas
3. Haz clic en un entrenamiento para ver todos los detalles

### Analizar Progreso

1. Ve a la pestaña **"Estadísticas"**
2. Verás el resumen general:
   - Total de entrenamientos
   - Ejercicios entrenados
   - Semanas completadas
3. Selecciona un ejercicio específico para ver:
   - Progreso en peso máximo
   - Progreso en volumen total
   - Historial completo con indicadores de mejora 🔥

## Estructura del Proyecto

```
next-gym-app/
├── app/
│   ├── api/                    # API Routes de Next.js
│   │   ├── ejercicios/         # Endpoints para ejercicios
│   │   ├── rutinas/            # Endpoints para rutinas
│   │   └── entrenamientos/     # Endpoints para entrenamientos
│   ├── components/             # Componentes React
│   │   ├── EjercicioForm.tsx
│   │   ├── EjerciciosList.tsx
│   │   ├── RutinaForm.tsx
│   │   ├── RutinasList.tsx
│   │   ├── EntrenamientoActivo.tsx
│   │   ├── HistorialEntrenamientos.tsx
│   │   └── Estadisticas.tsx
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout raíz
│   └── page.tsx                # Página principal
├── lib/
│   ├── models/                 # Modelos TypeScript
│   │   ├── Ejercicio.ts
│   │   ├── Rutina.ts
│   │   └── Entrenamiento.ts
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useEjercicios.ts
│   │   ├── useRutinas.ts
│   │   └── useEntrenamientos.ts
│   ├── google-sheets.ts        # Integración con Google Sheets API
│   └── api-client.ts           # Cliente para llamar a API Routes
├── .env.local.example          # Template de variables de entorno
├── .env.local                  # Tus variables de entorno (NO subir a Git)
└── README.md                   # Este archivo
```

## Despliegue en Vercel

1. Sube tu código a GitHub (asegúrate de NO incluir `.env.local`)

2. Ve a [Vercel](https://vercel.com/) e importa tu repositorio

3. En la configuración de deployment, agrega las variables de entorno:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`

4. Despliega la aplicación

## Troubleshooting

### Error: "Invalid grant" o "Unauthorized"

- Verifica que compartiste el Google Sheet con el email del Service Account
- Verifica que el Service Account tiene permisos de Editor
- Verifica que copiaste correctamente el `private_key` (debe incluir `\n` para los saltos de línea)

### Los datos no se guardan

- Verifica que las pestañas del Google Sheet tienen exactamente los nombres requeridos: `Ejercicios`, `Rutinas`, `Entrenamientos`
- Verifica que la primera fila tiene los encabezados correctos
- Revisa la consola del navegador y los logs del servidor para ver errores específicos

### Error al parsear JSON

- Asegúrate de que el `GOOGLE_PRIVATE_KEY` esté entre comillas en el `.env.local`
- Verifica que no haya espacios adicionales o caracteres especiales

## Soporte

Si tienes problemas con la configuración:

1. Revisa los logs en la terminal donde ejecutas `npm run dev`
2. Abre la consola del navegador (F12) para ver errores del cliente
3. Verifica que seguiste todos los pasos de configuración de Google Cloud y Google Sheets

## Próximas Mejoras

- [ ] Gráficas visuales de progreso
- [ ] Exportar datos a PDF
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App) para uso offline
- [ ] Recordatorios de entrenamientos

---

**¡Disfruta entrenando y trackeando tu progreso! 💪**
