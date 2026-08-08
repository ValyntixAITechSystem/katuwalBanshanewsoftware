// src/components/settings/SecuritySettings.jsx
import { useState, useEffect } from 'react';
import Toggle from '../Toggle';
import Button from '../Button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  getLoginHistory, 
  getActiveDevices, 
  forceLogoutAll,
  updateSecuritySettings 
} from '../../api/security';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';

const SecuritySettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorEnabled: false,
  });

  const [loginHistory, setLoginHistory] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: () => {
      toast.success('Security settings updated');
      onDataChange();
    },
  });

  const forceLogoutMutation = useMutation({
    mutationFn: forceLogoutAll,
    onSuccess: () => {
      toast.success('All devices logged out successfully');
      refetchActiveDevices();
    },
  });

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['loginHistory'],
    queryFn: getLoginHistory,
    enabled: false, // Fetch on demand
  });

  const { data: devicesData, refetch: refetchActiveDevices } = useQuery({
    queryKey: ['activeDevices'],
    queryFn: getActiveDevices,
  });

  useEffect(() => {
    if (data.settings?.security) {
      setSettings(data.settings.security);
    }
  }, [data.settings]);

  useEffect(() => {
    if (devicesData) {
      setActiveDevices(devicesData);
    }
  }, [devicesData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
    onDataChange();
  };

  const handlePasswordPolicyChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [name]: checked
      }
    }));
    onDataChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettingsMutation.mutateAsync(settings);
  };

  const handleForceLogout = () => {
    if (confirm('Are you sure you want to log out all devices?')) {
      forceLogoutMutation.mutate();
    }
  };

  const loadLoginHistory = () => {
    refetchHistory();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          name="sessionTimeout"
          value={settings.sessionTimeout}
          onChange={handleChange}
          min={5}
          max={480}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-sm text-gray-600 mt-1">Auto logout after inactivity (0 = never)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Policy
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="requireUppercase"
              checked={settings.passwordPolicy.requireUppercase}
              onChange={handlePasswordPolicyChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Require uppercase letters</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="requireLowercase"
              checked={settings.passwordPolicy.requireLowercase}
              onChange={handlePasswordPolicyChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Require lowercase letters</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="requireNumbers"
              checked={settings.passwordPolicy.requireNumbers}
              onChange={handlePasswordPolicyChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Require numbers</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="requireSpecialChars"
              checked={settings.passwordPolicy.requireSpecialChars}
              onChange={handlePasswordPolicyChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Require special characters</label>
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Minimum Length</label>
            <input
              type="number"
              name="minLength"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => {
                setSettings(prev => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  }
                }));
                onDataChange();
              }}
              min={6}
              max={20}
              className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-gray-200">
        <div>
          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">Enforce 2FA for all users</p>
        </div>
        <Toggle
          enabled={settings.twoFactorEnabled}
          onChange={(value) => {
            setSettings(prev => ({ ...prev, twoFactorEnabled: value }));
            onDataChange();
          }}
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Active Devices</h4>
        {activeDevices.length > 0 ? (
          <div className="space-y-2">
            {activeDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Icons.Device className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{device.name}</p>
                    <p className="text-xs text-gray-500">
                      {device.browser} • {device.os} • Last active: {new Date(device.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  device.current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {device.current ? 'Current' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No active devices found</p>
        )}
        
        <div className="mt-4">
          <Button
            type="button"
            variant="danger"
            onClick={handleForceLogout}
            disabled={forceLogoutMutation.isPending}
          >
            {forceLogoutMutation.isPending ? 'Logging out...' : 'Force Logout All Devices'}
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Login History</h4>
            <p className="text-sm text-gray-600">View recent login activities</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadLoginHistory}
          >
            <Icons.History className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateSettingsMutation.isPending}>
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Security Settings'}
        </Button>
      </div>
    </form>
  );
};

export default SecuritySettings;