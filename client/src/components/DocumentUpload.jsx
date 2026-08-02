// src/components/DocumentUpload.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { uploadDocument } from '../api/documents';
import { getMembers } from '../api/members';
import Button from './Button';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    documentType: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
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
        <ImageUpload
          onImageSelect={(selectedFile) => setFile(selectedFile)}
          label="Upload Document"
          maxSize={15}
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
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