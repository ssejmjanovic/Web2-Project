export type ShareAccessLevel = 'View' | 'Edit';

export interface Share {
    token: string;
    travelPlanId: number;
    accessLevel: ShareAccessLevel;
    createdAtUtc: string;
    expiresAtUtc: string | null;
    isRevoked: boolean;
}

export interface CreateShareRequest {
    travelPlanId: number;
    acessLevel: ShareAccessLevel;
    expiresInHours?: number;
}

export interface ShareValidationResult {
    isValid: boolean;
    travelPlanId: number;
    accessLevel: ShareAccessLevel;
    reason?: string;
}