import { api } from './api';

export const draftService = {
  getAll: (params = {}) => api.get('/drafts', { params }),
  getById: (id) => api.get(`/drafts/${id}`),
  create: (data) => api.post('/drafts', data),
  update: (id, data) => api.put(`/drafts/${id}`, data),
  delete: (id) => api.delete(`/drafts/${id}`),
  submit: (id) => api.put(`/drafts/${id}/submit`),
};