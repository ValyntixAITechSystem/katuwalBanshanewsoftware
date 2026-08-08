// src/components/settings/ReportSettings.jsx
import { useState, useEffect } from 'react';
import Toggle from '../Toggle';
import { useMutation } from '@tanstack/react-query';
import { updateReportSettings } from '../../api/settings';
import toast from 'react-hot-toast';

const ReportSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    defaultExportFormat: 'xlsx',
    includeMemberPhoto: true,
    includeContactDetails: true,
    includeAddress: true,
    includeFamilyInformation: true,
    autoColumnWidth: true,
    dateFormat: 'YYYY-MM-DD',
    excelFileNameFormat: '{report_type}_{date}',
  });

  const updateMutation = useMutation({
    mutationFn: updateReportSettings,
    onSuccess: () => {
      toast.success('Report settings updated');
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.settings?.reports) {
      setSettings(data.settings.reports);
    }
  }, [data.settings]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Export Format
        </label>
        <select
          name="defaultExportFormat"
          value={settings.defaultExportFormat}
          onChange={handleChange}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="pdf">PDF (.pdf)</option>
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
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excel File Name Format
        </label>
        <input
          type="text"
          name="excelFileNameFormat"
          value={settings.excelFileNameFormat}
          onChange={handleChange}
          placeholder="{report_type}_{date}"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-sm text-gray-600 mt-1">
          Use {'{report_type}'} and {'{date}'} as placeholders
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-medium text-gray-900">Include Member Photo</h4>
            <p className="text-sm text-gray-600">Include member photos in reports</p>
          </div>
          <Toggle
            enabled={settings.includeMemberPhoto}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, includeMemberPhoto: value }));
              onDataChange();
            }}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Include Contact Details</h4>
            <p className="text-sm text-gray-600">Include contact information in reports</p>
          </div>
          <Toggle
            enabled={settings.includeContactDetails}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, includeContactDetails: value }));
              onDataChange();
            }}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Include Address</h4>
            <p className="text-sm text-gray-600">Include address information in reports</p>
          </div>
          <Toggle
            enabled={settings.includeAddress}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, includeAddress: value }));
              onDataChange();
            }}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Include Family Information</h4>
            <p className="text-sm text-gray-600">Include family member information in reports</p>
          </div>
          <Toggle
            enabled={settings.includeFamilyInformation}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, includeFamilyInformation: value }));
              onDataChange();
            }}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Auto Column Width</h4>
            <p className="text-sm text-gray-600">Automatically adjust column width in Excel reports</p>
          </div>
          <Toggle
            enabled={settings.autoColumnWidth}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, autoColumnWidth: value }));
              onDataChange();
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Report Settings'}
        </Button>
      </div>
    </form>
  );
};

export default ReportSettings;