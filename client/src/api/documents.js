// src/api/documents.js
import axios from './axios';

export const getDocuments = async (params = {}) => {
  const { data } = await axios.get('/documents', { params });
  return data;
};

export const getDocumentById = async (id) => {
  const { data } = await axios.get(`/documents/${id}`);
  return data;
};

export const uploadDocument = async (formData) => {
  const { data } = await axios.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      // You can use this for progress tracking
      console.log(`Upload Progress: ${percentCompleted}%`);
    },
  });
  return data;
};

export const updateDocument = async (id, formData) => {
  const { data } = await axios.put(`/documents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteDocument = async (id) => {
  const { data } = await axios.delete(`/documents/${id}`);
  return data;
};

export const verifyDocument = async (id) => {
  const { data } = await axios.patch(`/documents/${id}/verify`);
  return data;
};

export const getDocumentsByMember = async (memberId) => {
  const { data } = await axios.get(`/documents/member/${memberId}`);
  return data;
};