'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirigir a la página principal
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--surface-elevated)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            💪
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Gym Tracker
          </h1>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Ingresa tu contraseña para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                border: error ? '2px solid var(--danger)' : '2px solid var(--border)',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = 'var(--border)';
              }}
            />
            {error && (
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: 'var(--danger)'
              }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: loading || !password ? 'var(--border)' : 'var(--primary)',
              color: 'white',
              borderRadius: '12px',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading || !password ? 0.6 : 1
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
