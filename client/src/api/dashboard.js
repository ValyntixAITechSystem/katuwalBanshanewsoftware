// src/api/dashboard.js
import axios from './axios';

export const getDashboardStats = async () => {
  const { data } = await axios.get('/dashboard/stats');
  return data;
};

export const getQuickStats = async () => {
  const { data } = await axios.get('/dashboard/quick-stats');
  return data;
};