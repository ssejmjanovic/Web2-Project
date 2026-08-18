let activeShareToken: string | null = null;

export function setActiveShareToken(token: string | null): void {
    activeShareToken = token;
}

export function getActiveShareToken(): string | null {
    return activeShareToken;
}