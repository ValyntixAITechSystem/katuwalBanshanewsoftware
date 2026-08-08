// src/components/settings/GeneralSettings.jsx
import { useState, useEffect } from 'react';
import ImageUpload from '../ImageUpload';
import Button from '../Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadLogo } from '../../api/organization';
import toast from 'react-hot-toast';

const GeneralSettings = ({ data, onDataChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    mission: '',
    vision: '',
    registrationNumber: '',
    establishedDate: '',
  });
  const [logoPreview, setLogoPreview] = useState('');
  const queryClient = useQueryClient();

  const logoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast.success('Logo uploaded successfully');
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.organization) {
      setFormData({
        name: data.organization.name || '',
        description: data.organization.description || '',
        address: data.organization.address || '',
        phone: data.organization.phone || '',
        email: data.organization.email || '',
        website: data.organization.website || '',
        mission: data.organization.mission || '',
        vision: data.organization.vision || '',
        registrationNumber: data.organization.registrationNumber || '',
        establishedDate: data.organization.establishedDate 
          ? new Date(data.organization.establishedDate).toISOString().split('T')[0] 
          : '',
      });
      if (data.organization.logo) {
        setLogoPreview(data.organization.logo);
      }
    }
  }, [data.organization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onDataChange();
  };

  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    await logoMutation.mutateAsync(formData);
    setLogoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        {logoPreview ? (
          <div className="relative">
            <img
              src={logoPreview}
              alt="Organization Logo"
              className="h-32 w-32 object-contain border-2 border-gray-200 rounded-lg"
            />
          </div>
        ) : (
          <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
            <span className="text-gray-500 text-sm">No Logo</span>
          </div>
        )}
        <div className="mt-2">
          <ImageUpload
            onImageSelect={handleLogoUpload}
            label="Upload Logo"
            maxSize={5}
            accept="image/*"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Established Date
          </label>
          <input
            type="date"
            name="establishedDate"
            value={formData.establishedDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mission
          </label>
          <textarea
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vision
          </label>
          <textarea
            name="vision"
            value={formData.vision}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;