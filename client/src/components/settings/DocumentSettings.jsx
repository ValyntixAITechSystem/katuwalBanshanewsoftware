// src/components/settings/DocumentSettings.jsx
import { useState, useEffect } from 'react';
import Toggle from '../Toggle';
import { useMutation } from '@tanstack/react-query';
import { updateDocumentSettings } from '../../api/settings';
import toast from 'react-hot-toast';
import * as Icons from 'lucide-react';

const DocumentSettings = ({ data, onDataChange }) => {
  const [settings, setSettings] = useState({
    allowedFileTypes: ['pdf', 'jpg', 'png', 'docx'],
    maxUploadSize: 10,
    autoRename: false,
    deleteOldFiles: false,
    storagePath: '/uploads/documents',
  });

  const updateMutation = useMutation({
    mutationFn: updateDocumentSettings,
    onSuccess: () => {
      toast.success('Document settings updated');
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.settings?.documents) {
      setSettings(data.settings.documents);
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

  const handleFileTypeToggle = (type) => {
    setSettings(prev => {
      const types = prev.allowedFileTypes.includes(type)
        ? prev.allowedFileTypes.filter(t => t !== type)
        : [...prev.allowedFileTypes, type];
      return { ...prev, allowedFileTypes: types };
    });
    onDataChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync(settings);
  };

  const fileTypes = [
    { id: 'pdf', label: 'PDF', icon: Icons.FilePdf },
    { id: 'jpg', label: 'JPG', icon: Icons.FileImage },
    { id: 'png', label: 'PNG', icon: Icons.FileImage },
    { id: 'docx', label: 'DOCX', icon: Icons.FileText },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Allowed File Types
        </label>
        <div className="flex flex-wrap gap-3">
          {fileTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = settings.allowedFileTypes.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleFileTypeToggle(type.id)}
                className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 mr-2 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Upload Size (MB)
        </label>
        <input
          type="number"
          name="maxUploadSize"
          value={settings.maxUploadSize}
          onChange={handleChange}
          min={1}
          max={100}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Storage Path
        </label>
        <input
          type="text"
          name="storagePath"
          value={settings.storagePath}
          onChange={handleChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-medium text-gray-900">Auto Rename Files</h4>
            <p className="text-sm text-gray-600">Automatically rename uploaded files with a unique identifier</p>
          </div>
          <Toggle
            enabled={settings.autoRename}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, autoRename: value }));
              onDataChange();
            }}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <h4 className="font-medium text-gray-900">Delete Old Files</h4>
            <p className="text-sm text-gray-600">Automatically delete files older than 30 days</p>
          </div>
          <Toggle
            enabled={settings.deleteOldFiles}
            onChange={(value) => {
              setSettings(prev => ({ ...prev, deleteOldFiles: value }));
              onDataChange();
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Document Settings'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentSettings;