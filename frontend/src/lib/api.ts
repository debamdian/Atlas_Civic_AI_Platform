import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;
