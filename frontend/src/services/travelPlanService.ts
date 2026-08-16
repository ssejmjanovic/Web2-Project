import api from './api';
import type { TravelPlan, TravelPlanInput, TravelPlanSummary } from '../models/travel';

export const travelPlanService = {
    getAll: async (): Promise<TravelPlanSummary[]> => {
        const response = await api.get<TravelPlanSummary[]>('/api/travel-plans');
        return response.data;
    },

    getById: async (id: number): Promise<TravelPlan> => {
        const response = await api.get<TravelPlan>(`/api/travel/travel-plans/${id}`);
        return response.data;
    },

    create: async (input: TravelPlanInput): Promise<TravelPlan> => {
        const response = await api.post<TravelPlan>('/api/travel-plans', input);
        return response.data;
    },

    update: async (id: number, input: TravelPlanInput): Promise<TravelPlan> => {
        const response = await api.put<TravelPlan>(`/api/travel-plans/${id}`, input);
        return response.data;
    },

    remove: async (id:number): Promise<void> => {
        await api.delete(`/api/travel-plans/${id}`);
    },
};