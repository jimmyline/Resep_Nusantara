const API_BASE_URL = '/api';

export async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const token = localStorage.getItem('authToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) throw new Error(payload?.message || 'Permintaan ke server gagal.');
    return payload;
}

export function saveSession(payload) {
    localStorage.setItem('authToken', payload.token);
    localStorage.setItem('loggedInUsername', payload.user.username);
    localStorage.setItem('userRole', payload.user.role || 'user');
}

export function clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('userRole');
}

export function getCurrentUsername() {
    return localStorage.getItem('loggedInUsername') || 'Pengguna';
}