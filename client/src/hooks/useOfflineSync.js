// src/hooks/useOfflineSync.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'offline_data';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);

  // Load pending actions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPendingActions(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    }
  }, []);

  // Save pending actions to localStorage
  const savePendingActions = useCallback((actions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
    setPendingActions(actions);
  }, []);

  // Add action to offline queue
  const addOfflineAction = useCallback((action) => {
    const newActions = [...pendingActions, { ...action, timestamp: Date.now() }];
    savePendingActions(newActions);
    toast.success('Action saved offline. Will sync when online.');
  }, [pendingActions, savePendingActions]);

  // Remove action from offline queue
  const removeOfflineAction = useCallback((index) => {
    const newActions = pendingActions.filter((_, i) => i !== index);
    savePendingActions(newActions);
  }, [pendingActions, savePendingActions]);

  // Sync all pending actions
  const syncPendingActions = useCallback(async (syncFunction) => {
    if (!isOnline || pendingActions.length === 0) return;

    toast.loading(`Syncing ${pendingActions.length} pending actions...`, {
      id: 'offline-sync',
    });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < pendingActions.length; i++) {
      const action = pendingActions[i];
      try {
        await syncFunction(action);
        successCount++;
        removeOfflineAction(i);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
        failCount++;
      }
    }

    toast.dismiss('offline-sync');
    
    if (successCount > 0) {
      toast.success(`Synced ${successCount} actions successfully`);
    }
    if (failCount > 0) {
      toast.error(`Failed to sync ${failCount} actions`);
    }
  }, [isOnline, pendingActions, removeOfflineAction]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    pendingActions,
    addOfflineAction,
    syncPendingActions,
    pendingCount: pendingActions.length,
  };
};