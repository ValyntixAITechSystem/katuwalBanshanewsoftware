// src/api/settings.js
import axios from './axios';

export const getSettings = async () => {
  const { data } = await axios.get('/settings');
  return data;
};

export const updateSettings = async (settings) => {
  const { data } = await axios.put('/settings', settings);
  return data;
};

export const updateNotificationSettings = async (notifications) => {
  const { data } = await axios.put('/settings/notifications', notifications);
  return data;
};

export const updateDocumentSettings = async (documents) => {
  const { data } = await axios.put('/settings/documents', documents);
  return data;
};

export const updateReportSettings = async (reports) => {
  const { data } = await axios.put('/settings/reports', reports);
  return data;
};

export const updateAppearanceSettings = async (appearance) => {
  const { data } = await axios.put('/settings/appearance', appearance);
  return data;
};

export const updateSystemSettings = async (system) => {
  const { data } = await axios.put('/settings/system', system);
  return data;
};