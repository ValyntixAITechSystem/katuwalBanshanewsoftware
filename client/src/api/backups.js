// src/api/backup.js
import axios from './axios';

export const getBackups = async (params = {}) => {
  const { data } = await axios.get('/backup', { params });
  return data;
};

export const createBackup = async () => {
  const { data } = await axios.post('/backup');
  return data;
};

export const deleteBackup = async (id) => {
  const { data } = await axios.delete(`/backup/${id}`);
  return data;
};

export const downloadBackup = async ({ id, fileName }) => {
  const response = await axios.get(`/backup/download/${id}`, {
    responseType: 'blob',
  });
  return { blob: response.data, fileName };
};