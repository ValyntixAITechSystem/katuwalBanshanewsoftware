// src/api/security.js
import axios from './axios';

export const getLoginHistory = async () => {
  const { data } = await axios.get('/security/login-history');
  return data;
};

export const getActiveDevices = async () => {
  const { data } = await axios.get('/security/active-devices');
  return data;
};

export const forceLogoutAll = async () => {
  const { data } = await axios.post('/security/force-logout');
  return data;
};

export const updateSecuritySettings = async (settings) => {
  const { data } = await axios.put('/security/settings', settings);
  return data;
};