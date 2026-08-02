// src/pages/Backups.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBackups, createBackup, deleteBackup, downloadBackup } from '../api/backups';
import Table from '../components/Table';
import Button from '../components/Button';
import { PlusIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
 

const Backups = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['backups', page],
    queryFn: () => getBackups({ page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success('Backup created successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success('Backup deleted successfully');
    },
  });

  const downloadMutation = useMutation({
    mutationFn: downloadBackup,
    onSuccess: (blob, filename) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    },
  });

  const handleCreateBackup = async () => {
    await createMutation.mutateAsync();
  };

  const handleDownload = async (id, fileName) => {
    await downloadMutation.mutateAsync({ id, fileName });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { key: 'fileName', label: 'File Name' },
    { key: 'fileSize', label: 'Size', type: 'filesize' },
    { key: 'backupType', label: 'Type' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backups</h1>
          <p className="text-gray-600">Manage database backups</p>
        </div>
        <Button
          onClick={handleCreateBackup}
          disabled={createMutation.isPending}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {createMutation.isPending ? 'Creating...' : 'Create Backup'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          customActions={(item) => (
            <>
              <button
                onClick={() => handleDownload(item._id, item.fileName)}
                className="text-blue-600 hover:text-blue-900 mr-3"
                title="Download"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-900"
                title="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default Backups;