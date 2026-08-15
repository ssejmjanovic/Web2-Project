import api from './api';
import type {
    ChangePasswordRequest,
    UpdateProfileRequest,
    User,
    UserRole,
} from '../models/user';

export const userService = {
    getCurrent: async (): Promise<User> => {
        const response = await api.get<User>('/api/users/me');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await api.put<User>('/api/users/me', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await api.put('/api/users/me/password', data);
    },

    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/api/users');
        return response.data;
    },

    updateRole: async (userId: number, role: UserRole): Promise<User> => {
        const response = await api.put<User>(`/api/users/${userId}/role`, { role });
        return response.data;
    },

    updateStatus: async (userId: number, isActive: boolean): Promise<User> => {
        const response = await api.put<User>(`/api/users/${userId}/status`, { isActive });
        return response.data;
    },
};