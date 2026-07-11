import axios from 'axios';
import { authStorage } from '../auth/storage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = authStorage.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error?.response?.data?.message ??
            (error?.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(' ')
                : error.message) ??
            'Request failed';

        return Promise.reject(new Error(message));
    }
);

export default api;
