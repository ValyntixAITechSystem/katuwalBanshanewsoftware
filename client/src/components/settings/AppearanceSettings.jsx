// src/components/settings/AppearanceSettings.jsx
import { useState, useEffect } from 'react';
import Toggle from '../Toggle';
import { useMutation } from '@tanstack/react-query';
import { updateAppearanceSettings } from '../../api/settings';
import toast from 'react-hot-toast';

const AppearanceSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    theme: 'system',
    primaryColor: '#2563eb',
    sidebarStyle: 'expanded',
    compactMode: false,
    borderRadius: 'medium',
  });

  const updateMutation = useMutation({
    mutationFn: updateAppearanceSettings,
    onSuccess: () => {
      toast.success('Appearance settings updated');
      onDataChange();
      // Apply theme
      applyTheme(settings);
    },
  });

  useEffect(() => {
    if (data.settings?.appearance) {
      setSettings(data.settings.appearance);
      applyTheme(data.settings.appearance);
    }
  }, [data.settings]);

  const applyTheme = (themeSettings) => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Theme
    if (themeSettings.theme === 'dark') {
      root.classList.add('dark');
    } else if (themeSettings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Primary color
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    
    // Border radius
    const radiusMap = {
      small: '4px',
      medium: '8px',
      large: '12px',
    };
    root.style.setProperty('--border-radius', radiusMap[themeSettings.borderRadius] || '8px');

    // Sidebar style
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (themeSettings.sidebarStyle === 'collapsed') {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }

    // Compact mode
    if (themeSettings.compactMode) {
      document.body.classList.add('compact');
    } else {
      document.body.classList.remove('compact');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    onDataChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync(settings);
  };

  const themes = [
    { id: 'light', label: 'Light Theme', icon: '☀️' },
    { id: 'dark', label: 'Dark Theme', icon: '🌙' },
    { id: 'system', label: 'System Theme', icon: '💻' },
  ];

  const sidebarStyles = [
    { id: 'expanded', label: 'Expanded' },
    { id: 'collapsed', label: 'Collapsed' },
  ];

  const borderRadiusOptions = [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <div className="flex space-x-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                setSettings(prev => ({ ...prev, theme: theme.id }));
                onDataChange();
              }}
              className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                settings.theme === theme.id
                  ? 'border-primary bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{theme.icon}</div>
              <div className="font-medium">{theme.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            name="primaryColor"
            value={settings.primaryColor}
            onChange={handleChange}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <input
            type="text"
            name="primaryColor"
            value={settings.primaryColor}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sidebar Style
        </label>
        <div className="flex space-x-4">
          {sidebarStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => {
                setSettings(prev => ({ ...prev, sidebarStyle: style.id }));
                onDataChange();
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-colors ${
                settings.sidebarStyle === style.id
                  ? 'border-primary bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{style.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <div className="flex space-x-4">
          {borderRadiusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setSettings(prev => ({ ...prev, borderRadius: option.id }));
                onDataChange();
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-colors ${
                settings.borderRadius === option.id
                  ? 'border-primary bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-medium text-gray-900">Compact Mode</h4>
            <p className="text-sm text-gray-600">Reduce spacing and padding throughout the application</p>
          </div>
          <Toggle
            enabled={settings.compactMode}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, compactMode: value }));
              onDataChange();
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Appearance Settings'}
        </Button>
      </div>
    </form>
  );
};

export default AppearanceSettings;