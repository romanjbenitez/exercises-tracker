// API Client for Next.js - calls local API routes

export const api = {
    // Ejercicios
    async getEjercicios() {
        const response = await fetch('/api/ejercicios');
        if (!response.ok) throw new Error('Error al obtener ejercicios');
        return response.json();
    },

    async createEjercicio(ejercicio: unknown) {
        const response = await fetch('/api/ejercicios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ejercicio)
        });
        if (!response.ok) throw new Error('Error al crear ejercicio');
        return response.json();
    },

    async updateEjercicio(id: string, ejercicio: unknown) {
        const response = await fetch(`/api/ejercicios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ejercicio)
        });
        if (!response.ok) throw new Error('Error al actualizar ejercicio');
        return response.json();
    },

    async deleteEjercicio(id: string) {
        const response = await fetch(`/api/ejercicios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar ejercicio');
    },

    // Rutinas
    async getRutinas() {
        const response = await fetch('/api/rutinas');
        if (!response.ok) throw new Error('Error al obtener rutinas');
        return response.json();
    },

    async createRutina(rutina: unknown) {
        const response = await fetch('/api/rutinas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rutina)
        });
        if (!response.ok) throw new Error('Error al crear rutina');
        return response.json();
    },

    async updateRutina(id: string, rutina: unknown) {
        const response = await fetch(`/api/rutinas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rutina)
        });
        if (!response.ok) throw new Error('Error al actualizar rutina');
        return response.json();
    },

    async deleteRutina(id: string) {
        const response = await fetch(`/api/rutinas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar rutina');
    },

    // Entrenamientos
    async getEntrenamientos() {
        const response = await fetch('/api/entrenamientos');
        if (!response.ok) throw new Error('Error al obtener entrenamientos');
        return response.json();
    },

    async createEntrenamiento(entrenamiento: unknown) {
        const response = await fetch('/api/entrenamientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entrenamiento)
        });
        if (!response.ok) throw new Error('Error al crear entrenamiento');
        return response.json();
    },

    async updateEntrenamiento(id: string, entrenamiento: unknown) {
        const response = await fetch(`/api/entrenamientos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entrenamiento)
        });
        if (!response.ok) throw new Error('Error al actualizar entrenamiento');
        return response.json();
    },

    async deleteEntrenamiento(id: string) {
        const response = await fetch(`/api/entrenamientos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar entrenamiento');
    }
};
