// src/components/settings/SystemSettings.jsx
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateSystemSettings } from '../../api/settings';
import toast from 'react-hot-toast';
import { getAppVersion } from '../../api/system';

const SystemSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    timeZone: 'Asia/Kathmandu',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24',
    currency: 'NPR',
    country: 'Nepal',
  });
  const [appVersion, setAppVersion] = useState('1.0.0');

  const updateMutation = useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      toast.success('System settings updated');
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.settings?.system) {
      setSettings(data.settings.system);
    }
    // Get app version
    getAppVersion().then(version => setAppVersion(version));
  }, [data.settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    onDataChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync(settings);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ne', label: 'Nepali' },
    { code: 'hi', label: 'Hindi' },
  ];

  const timeZones = [
    'Asia/Kathmandu',
    'Asia/Kolkata',
    'Asia/Dhaka',
    'Asia/Shanghai',
    'America/New_York',
    'Europe/London',
  ];

  const dateFormats = [
    'YYYY-MM-DD',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
  ];

  const timeFormats = [
    { value: '12', label: '12-hour (AM/PM)' },
    { value: '24', label: '24-hour' },
  ];

  const currencies = [
    { code: 'NPR', label: 'Nepalese Rupee (NPR)' },
    { code: 'USD', label: 'US Dollar (USD)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'GBP', label: 'British Pound (GBP)' },
    { code: 'INR', label: 'Indian Rupee (INR)' },
  ];

  const countries = [
    'Nepal',
    'India',
    'China',
    'United States',
    'United Kingdom',
    'Australia',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <select
            name="timeZone"
            value={settings.timeZone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <select
            name="dateFormat"
            value={settings.dateFormat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {dateFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Format
          </label>
          <select
            name="timeFormat"
            value={settings.timeFormat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {timeFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={settings.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Application Version</h4>
            <p className="text-sm text-gray-600">Current version of the application</p>
          </div>
          <span className="px-3 py-1 bg-gray-100 rounded-lg font-mono text-sm">
            v{appVersion}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save System Settings'}
        </Button>
      </div>
    </form>
  );
};

export default SystemSettings;