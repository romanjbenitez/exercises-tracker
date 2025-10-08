'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EjerciciosList from './components/EjerciciosList';
import RutinasList from './components/RutinasList';
import EntrenamientoActivo from './components/EntrenamientoActivo';
import HistorialEntrenamientos from './components/HistorialEntrenamientos';
import Estadisticas from './components/Estadisticas';
import { useEjercicios } from '@/lib/hooks/useEjercicios';
import { useRutinas } from '@/lib/hooks/useRutinas';
import { useEntrenamientos } from '@/lib/hooks/useEntrenamientos';

type Vista = 'entrenar' | 'historial' | 'estadisticas' | 'ejercicios' | 'rutinas';

const vistas: { id: Vista; label: string; icon: string }[] = [
  { id: 'entrenar', label: 'Entrenar', icon: '💪' },
  { id: 'historial', label: 'Historial', icon: '📋' },
  { id: 'estadisticas', label: 'Stats', icon: '📊' },
  { id: 'ejercicios', label: 'Ejercicios', icon: '⚙️' },
  { id: 'rutinas', label: 'Rutinas', icon: '📝' },
];

export default function Home() {
  const [vistaActual, setVistaActual] = useState<Vista>('entrenar');
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    }
  };

  const {
    ejercicios,
    crear: crearEjercicio,
    actualizar: actualizarEjercicio,
    eliminar: eliminarEjercicio
  } = useEjercicios();

  const {
    rutinas,
    crear: crearRutina,
    actualizar: actualizarRutina,
    eliminar: eliminarRutina
  } = useRutinas();

  const {
    entrenamientos,
    crear: crearEntrenamiento,
    eliminar: eliminarEntrenamiento
  } = useEntrenamientos();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--surface-elevated)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              💪
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Gym Tracker
            </h1>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {vistaActual === 'entrenar' && (
          <EntrenamientoActivo
            rutinas={rutinas}
            ejercicios={ejercicios}
            onGuardar={crearEntrenamiento}
          />
        )}

        {vistaActual === 'historial' && (
          <HistorialEntrenamientos
            entrenamientos={entrenamientos}
            onEliminar={eliminarEntrenamiento}
          />
        )}

        {vistaActual === 'estadisticas' && (
          <Estadisticas
            entrenamientos={entrenamientos}
            ejercicios={ejercicios}
          />
        )}

        {vistaActual === 'ejercicios' && (
          <EjerciciosList
            ejercicios={ejercicios}
            onCrear={crearEjercicio}
            onActualizar={actualizarEjercicio}
            onEliminar={eliminarEjercicio}
          />
        )}

        {vistaActual === 'rutinas' && (
          <RutinasList
            rutinas={rutinas}
            ejercicios={ejercicios}
            onCrear={crearRutina}
            onActualizar={actualizarRutina}
            onEliminar={eliminarRutina}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--surface-elevated)',
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        boxShadow: 'var(--shadow)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {vistas.map((vista) => (
          <button
            key={vista.id}
            onClick={() => setVistaActual(vista.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 0.5rem',
              backgroundColor: 'transparent',
              color: vistaActual === vista.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontWeight: vistaActual === vista.id ? '600' : '500',
              gap: '0.25rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
          >
            {vistaActual === vista.id && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '3px',
                backgroundColor: 'var(--primary)',
                borderRadius: '0 0 3px 3px'
              }} />
            )}
            <span style={{
              fontSize: '1.5rem',
              filter: vistaActual === vista.id ? 'none' : 'grayscale(0.3)'
            }}>
              {vista.icon}
            </span>
            <span>{vista.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
