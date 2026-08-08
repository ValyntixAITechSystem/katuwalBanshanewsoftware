// // src/api/families.js
// import axios from './axios';

// export const getFamilies = async (params = {}) => {
//   const { data } = await axios.get('/family', { params });
//   return data;
// };



// // NEW: Get family tree for a specific family
// export const getFamilyTreeByFamily = async (familyId) => {
//   const { data } = await axios.get(`/family/${familyId}/tree`);
//   return data;
// };

// export const getFamilyById = async (id) => {
//   const { data } = await axios.get(`/family/${id}`);
//   return data;
// };

// export const createFamily = async (formData) => {
//   const { data } = await axios.post('/family', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const updateFamily = async (id, formData) => {
//   const { data } = await axios.put(`/family/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const deleteFamily = async (id) => {
//   const { data } = await axios.delete(`/family/${id}`);
//   return data;
// };

// export const getFamilyStats = async () => {
//   const { data } = await axios.get('/family/stats');
//   return data;
// };

import axios from './axios';

export const getFamilies = async (params = {}) => {
  const { data } = await axios.get('/family', { params });
  return data;
};

// Get family tree for a specific family
export const getFamilyTreeByFamily = async (familyId) => {
  const { data } = await axios.get(`/family/${familyId}/tree`);
  return data;
};

export const getFamilyById = async (id) => {
  const { data } = await axios.get(`/family/${id}`);
  return data;
};

export const createFamily = async (formData) => {
  const { data } = await axios.post('/family', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateFamily = async (id, formData) => {
  const { data } = await axios.put(`/family/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteFamily = async (id) => {
  const { data } = await axios.delete(`/family/${id}`);
  return data;
};

export const getFamilyStats = async () => {
  const { data } = await axios.get('/family/stats');
  return data;
};