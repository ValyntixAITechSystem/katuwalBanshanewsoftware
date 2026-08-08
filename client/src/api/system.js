// src/api/system.js
import axios from './axios';

export const getAppVersion = async () => {
  const { data } = await axios.get('/system/version');
  return data.version;
};