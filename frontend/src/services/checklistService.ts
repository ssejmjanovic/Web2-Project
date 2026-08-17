import api from './api';
import type { ChecklistItem, ChecklistItemInput } from '../models/travel';

export const checklistService = {
  getForPlan: async (planId: number): Promise<ChecklistItem[]> => {
    const response = await api.get<ChecklistItem[]>(`/api/travel-plans/${planId}/checklist`);
    return response.data;
  },

  create: async (planId: number, input: ChecklistItemInput): Promise<ChecklistItem> => {
    const response = await api.post<ChecklistItem>(
      `/api/travel-plans/${planId}/checklist`, input);
    return response.data;
  },

  update: async (planId: number, id: number, input: ChecklistItemInput): Promise<ChecklistItem> => {
    const response = await api.put<ChecklistItem>(
      `/api/travel-plans/${planId}/checklist/${id}`, input);
    return response.data;
  },

  remove: async (planId: number, id: number): Promise<void> => {
    await api.delete(`/api/travel-plans/${planId}/checklist/${id}`);
  },
};