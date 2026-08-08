// src/pages/Settings.jsx
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganization, updateOrganization, uploadLogo } from '../api/organization';
import { getAdminProfile, updateAdminProfile, changePassword, updateTwoFactor } from '../api/admin';
import { getSettings, updateSettings } from '../api/settings';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';

// Import all section components
import GeneralSettings from '../components/settings/GeneralSettings';
import AdministratorSettings from '../components/settings/AdministratorSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import DocumentSettings from '../components/settings/DocumentSettings';
import ReportSettings from '../components/settings/ReportSettings';
import BackupSettings from '../components/settings/BackupSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import SystemSettings from '../components/settings/SystemSettings';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { id: 'general', label: 'General', icon: Icons.Building },
    { id: 'administrator', label: 'Administrator', icon: Icons.UserCog },
    { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
    { id: 'documents', label: 'Documents', icon: Icons.File },
    { id: 'reports', label: 'Reports', icon: Icons.BarChart3 },
    { id: 'backup', label: 'Backup & Restore', icon: Icons.Database },
    { id: 'appearance', label: 'Appearance', icon: Icons.Palette },
    { id: 'security', label: 'Security', icon: Icons.Shield },
    { id: 'system', label: 'System', icon: Icons.Settings },
  ];

  // Fetch all data
  const { data: orgData, refetch: refetchOrg } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganization,
  });

  const { data: adminData, refetch: refetchAdmin } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
  });

  const { data: settingsData, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Handle navigation
  const handleNavClick = (sectionId) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
  };

  // Handle save all changes
  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      // Save all sections data
      // This would be a batch save or individual saves
      await Promise.all([
        updateOrganization(orgData),
        updateAdminProfile(adminData),
        updateSettings(settingsData),
      ]);
      
      toast.success('All settings saved successfully');
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset logic here
      toast.success('Settings reset to default');
      setHasUnsavedChanges(false);
      refetchOrg();
      refetchAdmin();
      refetchSettings();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    navigate('/dashboard');
  };

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Render active section
  const renderSection = () => {
    const props = {
      data: {
        organization: orgData,
        admin: adminData,
        settings: settingsData,
      },
      onDataChange: () => setHasUnsavedChanges(true),
    };

    switch (activeSection) {
      case 'general':
        return <GeneralSettings {...props} />;
      case 'administrator':
        return <AdministratorSettings {...props} />;
      case 'notifications':
        return <NotificationSettings {...props} />;
      case 'documents':
        return <DocumentSettings {...props} />;
      case 'reports':
        return <ReportSettings {...props} />;
      case 'backup':
        return <BackupSettings {...props} />;
      case 'appearance':
        return <AppearanceSettings {...props} />;
      case 'security':
        return <SecuritySettings {...props} />;
      case 'system':
        return <SystemSettings {...props} />;
      default:
        return <GeneralSettings {...props} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Navigation */}
      <nav className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">⚙️ Settings</h2>
        </div>
        <div className="p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${
                  activeSection === item.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 pb-32">
          {/* Section Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage {navItems.find(item => item.id === activeSection)?.label.toLowerCase()} settings
            </p>
          </div>

          {/* Section Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderSection()}
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={isLoading || !hasUnsavedChanges}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;