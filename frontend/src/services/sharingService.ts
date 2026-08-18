import api from './api';
import type { CreateShareRequest, Share, ShareValidationResult } from '../models/sharing';

export const sharingService = {
  create: async (request: CreateShareRequest): Promise<Share> => {
    const response = await api.post<Share>('/api/shares', request);
    return response.data;
  },

  getForPlan: async (planId: number): Promise<Share[]> => {
    const response = await api.get<Share[]>(`/api/shares/plans/${planId}`);
    return response.data;
  },

  revoke: async (token: string): Promise<void> => {
    await api.delete(`/api/shares/${token}`);
  },

  validate: async (token: string): Promise<ShareValidationResult> => {
    const response = await api.post<ShareValidationResult>('/api/shares/validate', { token });
    return response.data;
  },
};