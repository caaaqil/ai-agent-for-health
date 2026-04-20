import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
    getProfile: (userId) => api.get(`/profile/${userId}`),
    updateProfile: (userId, profileData) => api.put(`/profile/${userId}`, profileData),
};

export const aiService = {
    chat: (userId, message) => api.post('/chat', { userId, message }),
    analyzeMeal: (userId, foodText) => api.post('/analyze-meal', { userId, foodText }),
    generateWorkout: (userId, goal) => api.post('/workout', { userId, goal }),
};

export default api;
