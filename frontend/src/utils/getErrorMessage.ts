import axios from 'axios';

export function getErrorMessage(
    error: unknown,
    fallback = 'Something went wrong. Please try again.',
): string {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as { message?: string; title?: string} | undefined;
            return data?.message ?? data?.title ?? fallback;
        }
        
        return fallback;
    }
