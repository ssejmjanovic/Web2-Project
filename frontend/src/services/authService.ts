import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../models/user';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('api/auth/register', data);
        return response.data;
    },
};