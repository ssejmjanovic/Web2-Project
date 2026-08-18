import axios from 'axios';
import { getActiveShareToken } from './shareToken';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use((config) => {
    const shareToken = getActiveShareToken();
    
    if(shareToken) {
        config.headers['X-Share-Token'] = shareToken;
    }
    
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;