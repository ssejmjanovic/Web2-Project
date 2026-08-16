import api from './api';
import type { Activity, ActivityInput } from '../models/travel';

export const activityService = {
  getForPlan: async (planId: number): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/api/travel-plans/${planId}/activities`);
    return response.data;
  },

  create: async (planId: number, input: ActivityInput): Promise<Activity> => {
    const response = await api.post<Activity>(
      `/api/travel-plans/${planId}/activities`, input);
    return response.data;
  },

  update: async (planId: number, id: number, input: ActivityInput): Promise<Activity> => {
    const response = await api.put<Activity>(
      `/api/travel-plans/${planId}/activities/${id}`, input);
    return response.data;
  },

  remove: async (planId: number, id: number): Promise<void> => {
    await api.delete(`/api/travel-plans/${planId}/activities/${id}`);
  },
};