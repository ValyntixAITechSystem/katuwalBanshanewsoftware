// src/components/settings/BackupSettings.jsx
import { useState, useEffect } from 'react';
import Button from '../Button';
import Toggle from '../Toggle';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
     getBackups,
  createBackup, 
  deleteBackup, 
  downloadBackup,
//   createBackup, 
//   restoreBackup, 
//   downloadBackup, 
//   getBackup
//   updateBackupSettings 
} from '../../api/backups';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';

const BackupSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    automaticBackup: 'weekly',
    backupLocation: '/backups',
  });
  const [backupInfo, setBackupInfo] = useState({
    lastBackupDate: null,
    backupSize: '0 MB',
  });

  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      toast.success('Backup created successfully');
      refetchBackupInfo();
      onDataChange();
    },
  });

  const restoreBackupMutation = useMutation({
    mutationFn: restoreBackup,
    onSuccess: () => {
      toast.success('Backup restored successfully');
      refetchBackupInfo();
    },
  });

  const downloadBackupMutation = useMutation({
    mutationFn: downloadBackup,
    onSuccess: (data) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Backup downloaded successfully');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateBackupSettings,
    onSuccess: () => {
      toast.success('Backup settings updated');
      onDataChange();
    },
  });

  const { data: backupData, refetch: refetchBackupInfo } = useQuery({
    queryKey: ['backupInfo'],
    queryFn: getBackupInfo,
  });

  useEffect(() => {
    if (backupData) {
      setBackupInfo({
        lastBackupDate: backupData.lastBackupDate,
        backupSize: backupData.backupSize,
      });
    }
  }, [backupData]);

  useEffect(() => {
    if (data.settings?.backup) {
      setSettings(data.settings.backup);
    }
  }, [data.settings]);

  const handleSettingChange = async (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    await updateSettingsMutation.mutateAsync({ ...settings, [name]: value });
  };

  const handleRestore = () => {
    if (confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      restoreBackupMutation.mutate();
    }
  };

  const handleCreateBackup = () => {
    createBackupMutation.mutate();
  };

  const handleDownloadBackup = () => {
    downloadBackupMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Icons.Database className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Create Backup</h4>
          <p className="text-sm text-gray-600 mb-3">Create a new backup of your data</p>
          <Button
            onClick={handleCreateBackup}
            disabled={createBackupMutation.isPending}
            className="w-full"
          >
            {createBackupMutation.isPending ? 'Creating...' : 'Create Backup'}
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Icons.Upload className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Restore Backup</h4>
          <p className="text-sm text-gray-600 mb-3">Restore data from a backup file</p>
          <Button
            variant="warning"
            onClick={handleRestore}
            disabled={restoreBackupMutation.isPending}
            className="w-full"
          >
            {restoreBackupMutation.isPending ? 'Restoring...' : 'Restore Backup'}
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Icons.Download className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Download Latest</h4>
          <p className="text-sm text-gray-600 mb-3">Download the latest backup file</p>
          <Button
            variant="outline"
            onClick={handleDownloadBackup}
            disabled={downloadBackupMutation.isPending}
            className="w-full"
          >
            {downloadBackupMutation.isPending ? 'Downloading...' : 'Download Backup'}
          </Button>
        </div>
      </div>

      {/* Backup Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <div>
          <label className="text-sm text-gray-600">Last Backup Date</label>
          <p className="font-medium">
            {backupInfo.lastBackupDate 
              ? new Date(backupInfo.lastBackupDate).toLocaleString()
              : 'No backup created yet'}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Backup Size</label>
          <p className="font-medium">{backupInfo.backupSize}</p>
        </div>
      </div>

      {/* Automatic Backup Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Automatic Backup</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Backup Frequency
          </label>
          <select
            name="automaticBackup"
            value={settings.automaticBackup}
            onChange={handleSettingChange}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="disabled">Disabled</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Backup Location
          </label>
          <input
            type="text"
            name="backupLocation"
            value={settings.backupLocation}
            onChange={handleSettingChange}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;