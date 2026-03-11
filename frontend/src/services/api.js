import axios from 'axios';

const API_URL = 'https://gym-management-system-backend-kuzi.onrender.com/api';

// Create an axios instance with auth header
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    updateMembership: (membershipType) => api.put('/auth/membership', { membershipType }),
};

export const classAPI = {
    getAll: () => api.get('/classes'),
};

export const trainerAPI = {
    getAll: () => api.get('/trainers'),
};

export const bookingAPI = {
    book: (classId) => api.post('/bookings', { classId }),
    getUserBookings: () => api.get('/bookings'),
};

export default api;
