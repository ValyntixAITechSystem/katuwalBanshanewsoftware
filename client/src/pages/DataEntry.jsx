import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember, updateMember, getMembers } from '../api/members';
import { getFamilies } from '../api/families';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import Camera from '../components/Camera';
import Select from 'react-select';
import toast from 'react-hot-toast';

const DataEntry = ({ member, onSuccess, onCancel }) => {
  const initialFormData = {
    // Personal Information
    name: '',
    gender: 'male',
    dob: '',
    placeOfBirth: '',
    bloodGroup: 'unknown',
    maritalStatus: 'single',
    isAlive: true,
    dod: '',
    occupation: '',
    education: '',
    religion: '',
    casteEthnicity: '',
    nationality: 'Nepali',

    // Contact Information
    phone: '',
    alternatePhone: '',
    email: '',

    // Address Information
    houseNumber: '',
    wardNumber: '',
    toleVillage: '',
    municipality: '',
    district: '',
    province: '',
    country: 'Nepal',
    currentAddress: '',
    permanentAddress: '',
    postalCode: '',

    // Family Information
    family: '',
    familyNumber: '',
    rollNumber: '',
    generation: 1,
    relationship: 'member',
    father: '',
    mother: '',
    grandfather: '',
    grandmother: '',
    spouse: '',
    guardian: '',
    familyContact: '',

    // Identification
    citizenshipNumber: '',
    citizenshipIssueDate: '',
    citizenshipIssueDistrict: '',
    nationalIdNumber: '',
    nationalIdIssueDate: '',

    // Passport
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',

    // Driving License
    drivingLicenseNumber: '',
    drivingLicenseCategory: '',
    drivingLicenseIssueDate: '',
    drivingLicenseExpiryDate: '',

    // Documents
    birthCertificate: '',
    marriageCertificate: '',
    deathCertificate: '',
    panCard: '',
    voterId: '',

    // Additional Information
    biography: '',
    notes: '',
    specialRemarks: '',
    medicalNotes: '',
    disabilityInfo: '',

    // Status
    status: 'active',
    verificationStatus: 'pending',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState('');
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [citizenshipBackPreview, setCitizenshipBackPreview] = useState('');
  const [nationalIdFront, setNationalIdFront] = useState(null);
  const [nationalIdFrontPreview, setNationalIdFrontPreview] = useState('');
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState('');
  const [drivingLicensePhoto, setDrivingLicensePhoto] = useState(null);
  const [drivingLicensePhotoPreview, setDrivingLicensePhotoPreview] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [cameraType, setCameraType] = useState('photo');

  const queryClient = useQueryClient();

  // Fetch families data
  const { data: familiesData, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch members data for dropdowns
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success('Member created successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      onSuccess?.();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create member');
    },
  });

  // Update member mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      toast.success('Member updated successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update member');
    },
  });

  // Reset form function
  const resetForm = () => {
    setFormData(initialFormData);
    setPhoto(null);
    setPhotoPreview('');
    setCitizenshipFront(null);
    setCitizenshipFrontPreview('');
    setCitizenshipBack(null);
    setCitizenshipBackPreview('');
    setNationalIdFront(null);
    setNationalIdFrontPreview('');
    setPassportPhoto(null);
    setPassportPhotoPreview('');
    setDrivingLicensePhoto(null);
    setDrivingLicensePhotoPreview('');
    setActiveTab('personal');
  };

  // Populate form when editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        gender: member.gender || 'male',
        dob: member.dob ? member.dob.split('T')[0] : '',
        placeOfBirth: member.placeOfBirth || '',
        bloodGroup: member.bloodGroup || 'unknown',
        maritalStatus: member.maritalStatus || 'single',
        isAlive: member.isAlive !== undefined ? member.isAlive : true,
        dod: member.dod ? member.dod.split('T')[0] : '',
        occupation: member.occupation || '',
        education: member.education || '',
        religion: member.religion || '',
        casteEthnicity: member.casteEthnicity || '',
        nationality: member.nationality || 'Nepali',
        phone: member.phone || '',
        alternatePhone: member.alternatePhone || '',
        email: member.email || '',
        houseNumber: member.houseNumber || '',
        wardNumber: member.wardNumber || '',
        toleVillage: member.toleVillage || '',
        municipality: member.municipality || '',
        district: member.district || '',
        province: member.province || '',
        country: member.country || 'Nepal',
        currentAddress: member.currentAddress || '',
        permanentAddress: member.permanentAddress || '',
        postalCode: member.postalCode || '',
        family: member.family?._id || '',
        familyNumber: member.familyNumber || '',
        rollNumber: member.rollNumber || '',
        generation: member.generation || 1,
        relationship: member.relationship || 'member',
        father: member.father?._id || '',
        mother: member.mother?._id || '',
        grandfather: member.grandfather?._id || '',
        grandmother: member.grandmother?._id || '',
        spouse: member.spouse?._id || '',
        guardian: member.guardian?._id || '',
        familyContact: member.familyContact || '',
        citizenshipNumber: member.citizenshipNumber || '',
        citizenshipIssueDate: member.citizenshipIssueDate ? member.citizenshipIssueDate.split('T')[0] : '',
        citizenshipIssueDistrict: member.citizenshipIssueDistrict || '',
        nationalIdNumber: member.nationalIdNumber || '',
        nationalIdIssueDate: member.nationalIdIssueDate ? member.nationalIdIssueDate.split('T')[0] : '',
        passportNumber: member.passportNumber || '',
        passportIssueDate: member.passportIssueDate ? member.passportIssueDate.split('T')[0] : '',
        passportExpiryDate: member.passportExpiryDate ? member.passportExpiryDate.split('T')[0] : '',
        drivingLicenseNumber: member.drivingLicenseNumber || '',
        drivingLicenseCategory: member.drivingLicenseCategory || '',
        drivingLicenseIssueDate: member.drivingLicenseIssueDate ? member.drivingLicenseIssueDate.split('T')[0] : '',
        drivingLicenseExpiryDate: member.drivingLicenseExpiryDate ? member.drivingLicenseExpiryDate.split('T')[0] : '',
        birthCertificate: member.birthCertificate || '',
        marriageCertificate: member.marriageCertificate || '',
        deathCertificate: member.deathCertificate || '',
        panCard: member.panCard || '',
        voterId: member.voterId || '',
        biography: member.biography || '',
        notes: member.notes || '',
        specialRemarks: member.specialRemarks || '',
        medicalNotes: member.medicalNotes || '',
        disabilityInfo: member.disabilityInfo || '',
        status: member.status || 'active',
        verificationStatus: member.verificationStatus || 'pending',
      });
      
      if (member.photo) setPhotoPreview(member.photo);
      if (member.citizenshipFront) setCitizenshipFrontPreview(member.citizenshipFront);
      if (member.citizenshipBack) setCitizenshipBackPreview(member.citizenshipBack);
      if (member.nationalIdFront) setNationalIdFrontPreview(member.nationalIdFront);
      if (member.passportPhoto) setPassportPhotoPreview(member.passportPhoto);
      if (member.drivingLicensePhoto) setDrivingLicensePhotoPreview(member.drivingLicensePhoto);
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const handlePhotoCapture = (file, type) => {
    if (!file) return;
    
    const setters = {
      photo: { file: setPhoto, preview: setPhotoPreview },
      citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
      citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
      nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
      passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
      drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
    };

    if (setters[type]) {
      setters[type].file(file);
      setters[type].preview(URL.createObjectURL(file));
      setShowCamera(false);
    }
  };

  const handleImageRemove = (type) => {
    const setters = {
      photo: { file: setPhoto, preview: setPhotoPreview },
      citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
      citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
      nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
      passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
      drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
    };
    if (setters[type]) {
      setters[type].file(null);
      setters[type].preview('');
    }
  };

  const memberOptions = (membersData?.data || []).map(m => ({
    value: m._id,
    label: `${m.name} (${m.familyNumber || 'No Family'})`,
  }));

  const familyOptions = (familiesData?.data || []).map(f => ({
    value: f._id,
    label: `${f.familyName} (${f.familyNumber})`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value !== undefined && value !== null && value !== '') {
          // Convert boolean to string for FormData
          if (typeof value === 'boolean') {
            submitData.append(key, String(value));
          } else {
            submitData.append(key, value);
          }
        }
      });

      // Append images
      if (photo) submitData.append('photo', photo);
      if (citizenshipFront) submitData.append('citizenshipFront', citizenshipFront);
      if (citizenshipBack) submitData.append('citizenshipBack', citizenshipBack);
      if (nationalIdFront) submitData.append('nationalIdFront', nationalIdFront);
      if (passportPhoto) submitData.append('passportPhoto', passportPhoto);
      if (drivingLicensePhoto) submitData.append('drivingLicensePhoto', drivingLicensePhoto);

      if (member) {
        await updateMutation.mutateAsync({ id: member._id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
    } catch (error) {
  console.log(error.response);
  console.log(error.response?.data);
  console.log(error.response?.data?.message);
  console.log(error.response?.data?.errors);
} finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'contact', label: 'Contact & Address' },
    { id: 'family', label: 'Family' },
    { id: 'identification', label: 'ID Cards' },
    { id: 'passport', label: 'Passport & License' },
    { id: 'documents', label: 'Documents' },
    { id: 'additional', label: 'Additional' },
  ];

  const renderImageUpload = (label, preview, onCamera, type) => (
    <div className="flex flex-col items-center">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={() => handleImageRemove(type)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs transition-colors"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <span className="text-gray-500 text-xs text-center px-1">{label}</span>
        </div>
      )}
      <div className="flex space-x-1 mt-2">
        <ImageUpload
          onImageSelect={(file) => {
            if (file) {
              const setters = {
                photo: { file: setPhoto, preview: setPhotoPreview },
                citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
                citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
                nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
                passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
                drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
              };
              if (setters[type]) {
                setters[type].file(file);
                setters[type].preview(URL.createObjectURL(file));
              }
            }
          }}
          label="Upload"
          maxSize={15}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setCameraType(type);
            setShowCamera(true);
          }}
          className="px-2 py-1 text-sm"
        >
          📷
        </Button>
      </div>
    </div>
  );

  // Loading state
  if (familiesLoading || membersLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {member ? 'Edit Member' : 'Add New Member'}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {member ? 'Editing existing member' : 'Creating new member'}
          </span>
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Photos & Documents</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {renderImageUpload('Photo', photoPreview, null, 'photo')}
          {renderImageUpload('Citizenship Front', citizenshipFrontPreview, null, 'citizenshipFront')}
          {renderImageUpload('Citizenship Back', citizenshipBackPreview, null, 'citizenshipBack')}
          {renderImageUpload('NID Front', nationalIdFrontPreview, null, 'nationalIdFront')}
          {renderImageUpload('Passport', passportPhotoPreview, null, 'passportPhoto')}
          {renderImageUpload('DL', drivingLicensePhotoPreview, null, 'drivingLicensePhoto')}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onCapture={(file) => handlePhotoCapture(file, cameraType)}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Tabs - Responsive */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1 sm:space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content - Responsive Grid */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Enter full name"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="City, District"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
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

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAlive"
                    checked={formData.isAlive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition"
                  />
                  <span className="text-sm text-gray-700">Is Alive</span>
                </label>
              </div>

              {!formData.isAlive && (
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
                  <input
                    type="date"
                    name="dod"
                    value={formData.dod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              )}

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Job title"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Highest degree"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Religion"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Caste / Ethnicity</label>
                <input
                  type="text"
                  name="casteEthnicity"
                  value={formData.casteEthnicity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Caste or ethnicity"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </>
          )}

          {/* Contact & Address */}
          {activeTab === 'contact' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="98XXXXXXXX"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Mobile</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="98XXXXXXXX"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="email@example.com"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="House #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                <input
                  type="text"
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Ward #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tole / Village</label>
                <input
                  type="text"
                  name="toleVillage"
                  value={formData.toleVillage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Tole or village name"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                <input
                  type="text"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Municipality name"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="District name"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Province #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Full current address"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Full permanent address"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Postal code"
                />
              </div>
            </>
          )}

          {/* Family Information */}
          {activeTab === 'family' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Family</label>
                <Select
                  options={familyOptions}
                  value={familyOptions.find(opt => opt.value === formData.family) || null}
                  onChange={(opt) => handleSelectChange('family', opt?.value)}
                  placeholder="Select Family"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Number</label>
                <input
                  type="text"
                  name="familyNumber"
                  value={formData.familyNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Family #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Roll #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Generation</label>
                <input
                  type="number"
                  name="generation"
                  value={formData.generation}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
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

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Contact</label>
                <input
                  type="tel"
                  name="familyContact"
                  value={formData.familyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Family contact number"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Father</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.father) || null}
                  onChange={(opt) => handleSelectChange('father', opt?.value)}
                  placeholder="Search Father"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.mother) || null}
                  onChange={(opt) => handleSelectChange('mother', opt?.value)}
                  placeholder="Search Mother"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Grandfather</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.grandfather) || null}
                  onChange={(opt) => handleSelectChange('grandfather', opt?.value)}
                  placeholder="Search Grandfather"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Grandmother</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.grandmother) || null}
                  onChange={(opt) => handleSelectChange('grandmother', opt?.value)}
                  placeholder="Search Grandmother"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Spouse</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.spouse) || null}
                  onChange={(opt) => handleSelectChange('spouse', opt?.value)}
                  placeholder="Search Spouse"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian</label>
                <Select
                  options={memberOptions}
                  value={memberOptions.find(opt => opt.value === formData.guardian) || null}
                  onChange={(opt) => handleSelectChange('guardian', opt?.value)}
                  placeholder="Search Guardian"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#d1d5db',
                      },
                    }),
                  }}
                />
              </div>
            </>
          )}

          {/* Identification */}
          {activeTab === 'identification' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number</label>
                <input
                  type="text"
                  name="citizenshipNumber"
                  value={formData.citizenshipNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Citizenship #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Issue Date</label>
                <input
                  type="date"
                  name="citizenshipIssueDate"
                  value={formData.citizenshipIssueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Issue District</label>
                <input
                  type="text"
                  name="citizenshipIssueDistrict"
                  value={formData.citizenshipIssueDistrict}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="District"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
                <input
                  type="text"
                  name="nationalIdNumber"
                  value={formData.nationalIdNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="NID #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">NID Issue Date</label>
                <input
                  type="date"
                  name="nationalIdIssueDate"
                  value={formData.nationalIdIssueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </>
          )}

          {/* Passport & License */}
          {activeTab === 'passport' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Passport #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issue Date</label>
                <input
                  type="date"
                  name="passportIssueDate"
                  value={formData.passportIssueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry Date</label>
                <input
                  type="date"
                  name="passportExpiryDate"
                  value={formData.passportExpiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
                <input
                  type="text"
                  name="drivingLicenseNumber"
                  value={formData.drivingLicenseNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="DL #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">DL Category</label>
                <input
                  type="text"
                  name="drivingLicenseCategory"
                  value={formData.drivingLicenseCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="A, B, C, etc."
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">DL Issue Date</label>
                <input
                  type="date"
                  name="drivingLicenseIssueDate"
                  value={formData.drivingLicenseIssueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">DL Expiry Date</label>
                <input
                  type="date"
                  name="drivingLicenseExpiryDate"
                  value={formData.drivingLicenseExpiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Certificate</label>
                <input
                  type="text"
                  name="birthCertificate"
                  value={formData.birthCertificate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Certificate #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Certificate</label>
                <input
                  type="text"
                  name="marriageCertificate"
                  value={formData.marriageCertificate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Certificate #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Death Certificate</label>
                <input
                  type="text"
                  name="deathCertificate"
                  value={formData.deathCertificate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Certificate #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                <input
                  type="text"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="PAN #"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
                <input
                  type="text"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Voter ID #"
                />
              </div>
            </>
          )}

          {/* Additional Information */}
          {activeTab === 'additional' && (
            <>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Write a brief biography..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Remarks</label>
                <textarea
                  name="specialRemarks"
                  value={formData.specialRemarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Any special remarks..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Medical information..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Disability Information</label>
                <textarea
                  name="disabilityInfo"
                  value={formData.disabilityInfo}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="Any disability information..."
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="deceased">Deceased</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <select
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                >
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Actions - Responsive */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || createMutation.isLoading || updateMutation.isLoading}
          className="w-full sm:w-auto order-1 sm:order-2"
        >
          {loading || createMutation.isLoading || updateMutation.isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            member ? 'Update Member' : 'Create Member'
          )}
        </Button>
      </div>
    </form>
  );
};

export default DataEntry;