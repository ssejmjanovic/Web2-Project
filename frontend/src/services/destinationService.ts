import api from './api';
import type { Destination, DestinationInput } from '../models/travel';

export const destinationService = {
  getForPlan: async (planId: number): Promise<Destination[]> => {
    const response = await api.get<Destination[]>(`/api/travel-plans/${planId}/destinations`);
    return response.data;
  },

  create: async (planId: number, input: DestinationInput): Promise<Destination> => {
    const response = await api.post<Destination>(
      `/api/travel-plans/${planId}/destinations`, input);
    return response.data;
  },

  update: async (planId: number, id: number, input: DestinationInput): Promise<Destination> => {
    const response = await api.put<Destination>(
      `/api/travel-plans/${planId}/destinations/${id}`, input);
    return response.data;
  },

  remove: async (planId: number, id: number): Promise<void> => {
    await api.delete(`/api/travel-plans/${planId}/destinations/${id}`);
  },
};