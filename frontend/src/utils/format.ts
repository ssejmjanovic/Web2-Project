import {format} from 'date-fns';

export function formatDate(value: string): string {
    return format(new Date(value), 'd MMM YYY');
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}