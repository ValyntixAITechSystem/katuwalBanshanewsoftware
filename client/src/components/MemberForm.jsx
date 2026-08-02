// src/components/MemberForm.jsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createMember, updateMember } from '../api/members';
import { getFamilies } from '../api/families';
import Button from './Button';
import ImageUpload from './ImageUpload';
import Camera from './Camera';
import toast from 'react-hot-toast';

const MemberForm = ({ member, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    family: '',
    familyNumber: '',
    rollNumber: '',
    generation: 1,
    relation: 'member',
    phone: '',
    email: '',
    dob: '',
    bloodGroup: 'unknown',
    education: '',
    occupation: '',
    maritalStatus: 'single',
    currentAddress: '',
    permanentAddress: '',
    isAlive: true,
    biography: '',
    notes: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: familiesData } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        gender: member.gender || 'male',
        family: member.family?._id || '',
        familyNumber: member.familyNumber || '',
        rollNumber: member.rollNumber || '',
        generation: member.generation || 1,
        relation: member.relation || 'member',
        phone: member.phone || '',
        email: member.email || '',
        dob: member.dob ? member.dob.split('T')[0] : '',
        bloodGroup: member.bloodGroup || 'unknown',
        education: member.education || '',
        occupation: member.occupation || '',
        maritalStatus: member.maritalStatus || 'single',
        currentAddress: member.currentAddress || '',
        permanentAddress: member.permanentAddress || '',
        isAlive: member.isAlive !== undefined ? member.isAlive : true,
        biography: member.biography || '',
        notes: member.notes || '',
      });
      if (member.photo) {
        setPhotoPreview(member.photo);
      }
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoCapture = (photoData) => {
    setPhoto(photoData);
    setPhotoPreview(URL.createObjectURL(photoData));
    setShowCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      // Object.keys(formData).forEach((key) => {
      //   if (formData[key] !== undefined && formData[key] !== null) {
      //     submitData.append(key, formData[key]);
      //   }
      // });
      Object.keys(formData).forEach((key) => {
  const value = formData[key];

  // Empty family field नपठाउने
  if (key === "family" && value === "") {
    return;
  }

  if (value !== undefined && value !== null && value !== "") {
    submitData.append(key, value);
  }
});

      // Append photo if exists
      if (photo) {
        submitData.append('photo', photo);
      }

      if (member) {
        await updateMember(member._id, submitData);
        toast.success('Member updated successfully');
      } else {
        await createMember(submitData);
        toast.success('Member created successfully');
      }

      onSuccess?.();
    } catch (error) {
      toast.error(error.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="flex flex-col items-center">
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoPreview('');
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
            <span className="text-gray-500 text-sm">No Photo</span>
          </div>
        )}
        <div className="flex space-x-2 mt-2">
          <ImageUpload
            onImageSelect={(file) => {
              setPhoto(file);
              setPhotoPreview(URL.createObjectURL(file));
            }}
            label="Upload Photo"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCamera(true)}
          >
            📷 Camera
          </Button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Family
          </label>
          <select
            name="family"
            value={formData.family}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Family</option>
            {familiesData?.data?.map((family) => (
              <option key={family._id} value={family._id}>
                {family.familyName} ({family.familyNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Family Number
          </label>
          <input
            type="text"
            name="familyNumber"
            value={formData.familyNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Generation
          </label>
          <input
            type="number"
            name="generation"
            value={formData.generation}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relation
          </label>
          <select
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="member">Member</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="grandparent">Grandparent</option>
            <option value="grandchild">Grandchild</option>
            <option value="other">Other</option>
          </select>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="unknown">Unknown</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Education
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Address
          </label>
          <textarea
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permanent Address
          </label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAlive"
              checked={formData.isAlive}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Is Alive</span>
          </label>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biography
          </label>
          <textarea
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} >
          {loading ? 'Saving...' : member ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;