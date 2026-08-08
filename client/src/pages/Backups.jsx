// // src/pages/Backups.jsx
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getBackups, createBackup, deleteBackup, downloadBackup } from '../api/backups';
// import Table from '../components/Table';
// import Button from '../components/Button';
// import { PlusIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';
 

// const Backups = () => {
//   const [page, setPage] = useState(1);
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ['backups', page],
//     queryFn: () => getBackups({ page, limit: 10 }),
//   });

//   const createMutation = useMutation({
//     mutationFn: createBackup,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['backups'] });
//       toast.success('Backup created successfully');
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteBackup,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['backups'] });
//       toast.success('Backup deleted successfully');
//     },
//   });

//   const downloadMutation = useMutation({
//     mutationFn: downloadBackup,
//     onSuccess: (blob, filename) => {
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success('Backup downloaded successfully');
//     },
//   });

//   const handleCreateBackup = async () => {
//     await createMutation.mutateAsync();
//   };

//   const handleDownload = async (id, fileName) => {
//     await downloadMutation.mutateAsync({ id, fileName });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this backup?')) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const columns = [
//     { key: 'fileName', label: 'File Name' },
//     { key: 'fileSize', label: 'Size', type: 'filesize' },
//     { key: 'backupType', label: 'Type' },
//     { key: 'status', label: 'Status', type: 'status' },
//     { key: 'createdAt', label: 'Created', type: 'date' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Backups</h1>
//           <p className="text-gray-600">Manage database backups</p>
//         </div>
//         <Button
//           onClick={handleCreateBackup}
//           disabled={createMutation.isPending}
//           className="flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           {createMutation.isPending ? 'Creating...' : 'Create Backup'}
//         </Button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <Table
//           columns={columns}
//           data={data?.data || []}
//           loading={isLoading}
//           customActions={(item) => (
//             <>
//               <button
//                 onClick={() => handleDownload(item._id, item.fileName)}
//                 className="text-blue-600 hover:text-blue-900 mr-3"
//                 title="Download"
//               >
//                 <ArrowDownTrayIcon className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => handleDelete(item._id)}
//                 className="text-red-600 hover:text-red-900"
//                 title="Delete"
//               >
//                 <TrashIcon className="h-5 w-5" />
//               </button>
//             </>
//           )}
//           pagination={{
//             currentPage: data?.pagination?.page || 1,
//             totalPages: data?.pagination?.pages || 1,
//             onPageChange: setPage,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Backups;


// src/components/settings/BackupSettings.jsx
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getBackups,
  createBackup, 
  deleteBackup, 
  downloadBackup,
} from '../api/backups';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';
import Table from '../components/Table';

const BackupSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    automaticBackup: 'weekly',
    backupLocation: '/backups',
  });
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch backups list
  const { data: backupsData, isLoading, refetch } = useQuery({
    queryKey: ['backups', page],
    queryFn: () => getBackups({ page, limit: 5 }),
  });

  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success('Backup created successfully');
      onDataChange();
    },
  });

  const deleteBackupMutation = useMutation({
    mutationFn: deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success('Backup deleted successfully');
    },
  });

  const downloadBackupMutation = useMutation({
    mutationFn: downloadBackup,
    onSuccess: ({ blob, fileName }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    },
  });

  // Get latest backup info for display
  const latestBackup = backupsData?.data?.[0] || null;

  const handleCreateBackup = async () => {
    await createBackupMutation.mutateAsync();
  };

  const handleDownloadBackup = async (id, fileName) => {
    await downloadBackupMutation.mutateAsync({ id, fileName });
  };

  const handleDeleteBackup = (id) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      deleteBackupMutation.mutate(id);
    }
  };

  const handleSettingChange = async (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    // You can save these settings to your API if needed
    onDataChange();
  };

  // Backup table columns
  const backupColumns = [
    { key: 'fileName', label: 'File Name' },
    { key: 'fileSize', label: 'Size', type: 'filesize' },
    { key: 'backupType', label: 'Type' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  // Custom actions for backup table
  const backupCustomActions = (item) => (
    <>
      <button
        onClick={() => handleDownloadBackup(item._id, item.fileName)}
        className="text-blue-600 hover:text-blue-900 mr-3"
        title="Download"
      >
        <Icons.Download className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDeleteBackup(item._id)}
        className="text-red-600 hover:text-red-900"
        title="Delete"
      >
        <Icons.Trash2 className="h-5 w-5" />
      </button>
    </>
  );

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
            onClick={() => {
              if (confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
                // Implement restore functionality
                toast.info('Restore functionality coming soon');
              }
            }}
            className="w-full"
          >
            Restore Backup
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Icons.Download className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-medium text-gray-900">Download Latest</h4>
          <p className="text-sm text-gray-600 mb-3">Download the latest backup file</p>
          <Button
            variant="outline"
            onClick={() => {
              if (latestBackup) {
                handleDownloadBackup(latestBackup._id, latestBackup.fileName);
              } else {
                toast.error('No backup available to download');
              }
            }}
            disabled={!latestBackup || downloadBackupMutation.isPending}
            className="w-full"
          >
            {downloadBackupMutation.isPending ? 'Downloading...' : 'Download Backup'}
          </Button>
        </div>
      </div>

      {/* Backup List */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Recent Backups</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <Icons.RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            columns={backupColumns}
            data={backupsData?.data || []}
            loading={isLoading}
            customActions={backupCustomActions}
            pagination={{
              currentPage: backupsData?.pagination?.page || 1,
              totalPages: backupsData?.pagination?.pages || 1,
              onPageChange: setPage,
            }}
          />
        </div>
      </div>

      {/* Backup Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div>
          <label className="text-sm text-gray-600">Last Backup Date</label>
          <p className="font-medium">
            {latestBackup?.createdAt 
              ? new Date(latestBackup.createdAt).toLocaleString()
              : 'No backup created yet'}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Latest Backup Size</label>
          <p className="font-medium">{latestBackup?.fileSize || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Total Backups</label>
          <p className="font-medium">{backupsData?.pagination?.total || 0}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Backup Location</label>
          <p className="font-medium">{settings.backupLocation}</p>
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