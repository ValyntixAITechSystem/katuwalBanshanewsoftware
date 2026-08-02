// src/api/chat.js
import axios from './axios';

export const getChatRooms = async () => {
  const { data } = await axios.get('/chat/rooms');
  return data;
};

export const getChatMessages = async (room, params = {}) => {
  const { data } = await axios.get(`/chat/rooms/${room}/messages`, { params });
  return data;
};

export const sendMessage = async (messageData) => {
  const { data } = await axios.post('/chat/messages', messageData);
  return data;
};

export const markMessagesAsRead = async (room) => {
  const { data } = await axios.put(`/chat/rooms/${room}/read`);
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await axios.get('/chat/unread');
  return data;
};