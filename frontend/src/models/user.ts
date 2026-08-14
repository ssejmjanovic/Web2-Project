export type UserRole = 'User' | 'Admin';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: string;
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    expiresAtUtc: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}