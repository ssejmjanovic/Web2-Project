import api from './api';
import type { Expense, ExpenseInput } from '../models/travel';

export const expenseService = {
  getForPlan: async (planId: number): Promise<Expense[]> => {
    const response = await api.get<Expense[]>(`/api/travel-plans/${planId}/expenses`);
    return response.data;
  },

  create: async (planId: number, input: ExpenseInput): Promise<Expense> => {
    const response = await api.post<Expense>(
      `/api/travel-plans/${planId}/expenses`, input);
    return response.data;
  },

  update: async (planId: number, id: number, input: ExpenseInput): Promise<Expense> => {
    const response = await api.put<Expense>(
      `/api/travel-plans/${planId}/expenses/${id}`, input);
    return response.data;
  },

  remove: async (planId: number, id: number): Promise<void> => {
    await api.delete(`/api/travel-plans/${planId}/expenses/${id}`);
  },
};