// src/api/reports.js
import axios from './axios';

export const generateGenealogyReport = async (params = {}) => {
  const { data } = await axios.get('/reports/genealogy', { 
    params, 
    responseType: 'blob' 
  });
  return data;
};

export const generateFamilyReport = async (params = {}) => {
  const { data } = await axios.get('/reports/family', { 
    params, 
    responseType: 'blob' 
  });
  return data;
};

export const generateGenerationReport = async (params = {}) => {
  const { data } = await axios.get('/reports/generation', { 
    params, 
    responseType: 'blob' 
  });
  return data;
};

export const generateDonationReport = async (params = {}) => {
  const { data } = await axios.get('/reports/donation', { 
    params, 
    responseType: 'blob' 
  });
  return data;
};

export const generateDemographicReport = async (params = {}) => {
  const { data } = await axios.get('/reports/demographic', { 
    params, 
    responseType: 'blob' 
  });
  return data;
};