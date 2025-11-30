// Helper para hacer peticiones autenticadas a la API
const API_BASE_URL = 'http://localhost:3000/api';

// Obtener el token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Hacer petición GET autenticada
async function fetchWithAuth(endpoint) {
    const token = getToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401 || response.status === 403) {
        // Token inválido o expirado, redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

// Hacer petición POST autenticada
async function postWithAuth(endpoint, data) {
    const token = getToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

// Exportar funciones
window.apiHelper = {
    getToken,
    isAuthenticated,
    fetchWithAuth,
    postWithAuth,
    API_BASE_URL
};
