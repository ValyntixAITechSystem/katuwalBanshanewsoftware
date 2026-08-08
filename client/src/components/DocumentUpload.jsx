// src/components/DocumentUpload.jsx
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { uploadDocument } from '../api/documents';
import { getMembers } from '../api/members';
import Button from './Button';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    documentType: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 15 * 1024 * 1024) {
        toast.error('File size must be less than 15MB');
        return;
      }
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast.error('File size must be less than 15MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }

    if (!formData.documentType) {
      toast.error('Please select document type');
      return;
    }

    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append('file', file);

      await uploadDocument(submitData);
      toast.success('Document uploaded successfully');
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Member *
        </label>
        <select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Member</option>
          {membersData?.data?.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.familyNumber})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Type *
        </label>
        <select
          name="documentType"
          value={formData.documentType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Type</option>
          <option value="citizenship">Citizenship</option>
          <option value="birth_certificate">Birth Certificate</option>
          <option value="marriage_certificate">Marriage Certificate</option>
          <option value="death_certificate">Death Certificate</option>
          <option value="educational_certificate">Educational Certificate</option>
          <option value="passport">Passport</option>
          <option value="photo_album">Photo Album</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          File *
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
          />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary">Click to upload</span>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, JPG, PNG, GIF, WEBP up to 15MB
            </p>
          </div>
        </div>
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUpload;