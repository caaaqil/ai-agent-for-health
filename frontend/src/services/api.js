import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

/**
 * POST that consumes a streamed text/plain response token-by-token.
 * `onToken(fullTextSoFar)` is called on every chunk so the UI can update live.
 * Returns the complete text when the stream finishes.
 */
export async function streamPost(path, body, onToken) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) {
        let message = 'Request failed';
        try { message = (await res.json()).message || message; } catch { /* not json */ }
        throw new Error(message);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        onToken?.(full);
    }
    return full;
}

export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
    getProfile: (userId) => api.get(`/profile/${userId}`),
    updateProfile: (userId, profileData) => api.put(`/profile/${userId}`, profileData),
};

export const aiService = {
    chat: (userId, message) => api.post('/ai/chat', { userId, message }),
    analyzeMeal: (userId, foodText) => api.post('/ai/analyze-meal', { userId, foodText }),
    generateWorkout: (userId, goal) => api.post('/ai/generate-workout', { userId, goal }),
};

export default api;
