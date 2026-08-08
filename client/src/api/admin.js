// src/api/admin.js
import axios from './axios';

export const getAdminProfile = async () => {
  const { data } = await axios.get('/admin/profile');
  return data;
};

export const updateAdminProfile = async (profile) => {
  const { data } = await axios.put('/admin/profile', profile);
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await axios.put('/admin/change-password', passwordData);
  return data;
};

export const updateTwoFactor = async (twoFactorData) => {
  const { data } = await axios.put('/admin/two-factor', twoFactorData);
  return data;
};