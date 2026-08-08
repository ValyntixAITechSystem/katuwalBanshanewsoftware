// src/components/settings/AdministratorSettings.jsx
import { useState, useEffect } from 'react';
import ImageUpload from '../ImageUpload';
import Toggle from '../Toggle';
import { useMutation } from '@tanstack/react-query';
import { updateAdminProfile, changePassword, updateTwoFactor } from '../../api/admin';
import toast from 'react-hot-toast';

const AdministratorSettings = ({ data, onDataChange }) => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    profilePicture: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');

  const updateProfileMutation = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      onDataChange();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
  });

  const twoFactorMutation = useMutation({
    mutationFn: updateTwoFactor,
    onSuccess: () => {
      toast.success(`Two-factor authentication ${twoFactorEnabled ? 'enabled' : 'disabled'}`);
      onDataChange();
    },
  });

  useEffect(() => {
    if (data.admin) {
      setProfileData({
        fullName: data.admin.fullName || '',
        username: data.admin.username || '',
        email: data.admin.email || '',
        phoneNumber: data.admin.phoneNumber || '',
        profilePicture: data.admin.profilePicture || '',
      });
      setTwoFactorEnabled(data.admin.twoFactorEnabled || false);
      if (data.admin.profilePicture) {
        setProfilePreview(data.admin.profilePicture);
      }
    }
  }, [data.admin]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    onDataChange();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync(profileData);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await changePasswordMutation.mutateAsync({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleTwoFactorToggle = async () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    await twoFactorMutation.mutateAsync({ enabled: newState });
  };

  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    await updateProfileMutation.mutateAsync(formData);
    setProfilePreview(URL.createObjectURL(file));
    onDataChange();
  };

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Photo</span>
              </div>
            )}
            <div className="mt-2">
              <ImageUpload
                onImageSelect={handleProfilePictureUpload}
                label="Upload Photo"
                maxSize={2}
                accept="image/*"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password *
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Enable or disable two-factor authentication for your account</p>
          </div>
          <Toggle
            enabled={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
            disabled={twoFactorMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default AdministratorSettings;