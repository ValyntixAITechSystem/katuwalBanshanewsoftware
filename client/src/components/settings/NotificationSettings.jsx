// src/components/settings/NotificationSettings.jsx
import { useState, useEffect } from 'react';
import Toggle from '../Toggle';
import { useMutation } from '@tanstack/react-query';
import { updateNotificationSettings } from '../../api/settings';
import toast from 'react-hot-toast';

const NotificationSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    donationNotifications: true,
    newMemberNotifications: true,
    birthdayNotifications: true,
    familyUpdateNotifications: true,
    chatNotifications: true,
    soundNotifications: true,
  });

  const updateMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      toast.success('Notification settings updated');
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.settings?.notifications) {
      setSettings(data.settings.notifications);
    }
  }, [data.settings]);

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await updateMutation.mutateAsync(newSettings);
  };

  const notificationItems = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
    { key: 'browserNotifications', label: 'Browser Notifications', description: 'Receive notifications in your browser' },
    { key: 'donationNotifications', label: 'Donation Notifications', description: 'Get notified about new donations' },
    { key: 'newMemberNotifications', label: 'New Member Notifications', description: 'Get notified when new members join' },
    { key: 'birthdayNotifications', label: 'Birthday Notifications', description: 'Get notified about member birthdays' },
    { key: 'familyUpdateNotifications', label: 'Family Update Notifications', description: 'Get notified about family updates' },
    { key: 'chatNotifications', label: 'Chat Notifications', description: 'Get notified about new chat messages' },
    { key: 'soundNotifications', label: 'Sound Notifications', description: 'Play sounds for notifications' },
  ];

  return (
    <div className="space-y-6">
      {notificationItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div>
            <h4 className="font-medium text-gray-900">{item.label}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <Toggle
            enabled={settings[item.key]}
            onChange={() => handleToggle(item.key)}
            disabled={updateMutation.isPending}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationSettings;