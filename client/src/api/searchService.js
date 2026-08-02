import { api } from './api';

export const searchService = {
  globalSearch: (query) => api.get('/search', { params: { query } }),
  searchMembers: (query, params = {}) => api.get('/search/members', { params: { query, ...params } }),
  searchFamilies: (query, params = {}) => api.get('/search/families', { params: { query, ...params } }),
};