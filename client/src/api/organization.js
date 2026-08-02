// src/api/organization.js
import axios from './axios';

export const getOrganization = async () => {
  const { data } = await axios.get('/organization');
  return data;
};

export const createOrganization = async (formData) => {
  const { data } = await axios.post('/organization', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateOrganization = async (formData) => {
  const { data } = await axios.put('/organization', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteOrganization = async () => {
  const { data } = await axios.delete('/organization');
  return data;
};

export const uploadLogo = async (formData) => {
  const { data } = await axios.post('/organization/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};