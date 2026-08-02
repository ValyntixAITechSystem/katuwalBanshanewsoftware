import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../api/notificationService';
import { socketService } from '../api/socketService';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'
  );

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const socket = socketService.connect();
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:deleted', handleNotificationDeleted);

    return () => {
      socket.off('notification:new');
      socket.off('notification:read');
      socket.off('notification:deleted');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAll({ limit: 50 });
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const handleNotificationRead = (notification) => {
    setNotifications(prev =>
      prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationDeleted = ({ id }) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const markNotificationAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    language,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    switchLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};