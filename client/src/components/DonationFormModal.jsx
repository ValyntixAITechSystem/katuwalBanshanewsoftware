import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation, updateDonation } from '../api/donations';
import { getMembers } from '../api/members';
import Button from './Buttons';
import QRCodeDisplay from './QRCodeDisplay';

const DonationFormModal = ({ isOpen, onClose, donation, mode = 'create' }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    donorType: 'external',
    donorId: '',
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    amount: '',
    paymentMethod: 'cash',
    category: 'general',
    donationDate: new Date().toISOString().split('T')[0],
    purpose: '',
    remarks: '',
    isAnonymous: false,
    qrPaymentCompleted: false,
  });

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (donation && mode === 'edit') {
      setFormData({
        ...donation,
        donationDate: new Date(donation.donationDate).toISOString().split('T')[0],
      });
      if (donation.donorId) {
        setSelectedMember(donation.donorId);
      }
    }
  }, [donation, mode]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers({ limit: 100 });
        setMembers(data.data || []);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === 'edit') {
        return updateDonation(donation._id, data);
      }
      return createDonation(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donationStats'] });
      onClose();
    },

    onError: (error) => {
      console.log('❌ Error Response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save donation. Please check all fields.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    // ✅ FIX: Only add donorId if donor is member/family AND selected
    if (
      (formData.donorType === 'member' || formData.donorType === 'family') &&
      selectedMember
    ) {
      submitData.donorId = selectedMember;
    } else {
      // ❌ DON'T send null - just delete the property
      delete submitData.donorId;
    }

    // ✅ FIX: Remove empty fields that cause validation errors
    if (!submitData.donorEmail || submitData.donorEmail.trim() === '') {
      delete submitData.donorEmail;
    }
    if (!submitData.donorPhone || submitData.donorPhone.trim() === '') {
      delete submitData.donorPhone;
    }
    if (!submitData.purpose || submitData.purpose.trim() === '') {
      delete submitData.purpose;
    }
    if (!submitData.remarks || submitData.remarks.trim() === '') {
      delete submitData.remarks;
    }

    console.log('📤 Submitting:', submitData);
    mutation.mutate(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If donor type changes to external, clear member selection
    if (field === 'donorType' && value === 'external') {
      setSelectedMember(null);
      setFormData((prev) => ({
        ...prev,
        donorId: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Donation' : 'Add New Donation'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QR Code Display - Fixed on the right */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <QRCodeDisplay />
            </div>

            {/* Donation Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 order-1 lg:order-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donor Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donor Type *
                  </label>
                  <select
                    value={formData.donorType}
                    onChange={(e) => handleChange('donorType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="member">Member</option>
                    <option value="family">Family</option>
                    <option value="external">External Donor</option>
                  </select>
                </div>

                {/* Member Selection (if donor type is member or family) */}
                {(formData.donorType === 'member' || formData.donorType === 'family') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select {formData.donorType === 'member' ? 'Member' : 'Family Member'} *
                    </label>
                    <select
                      value={selectedMember || ''}
                      onChange={(e) => {
                        const memberId = e.target.value;
                        setSelectedMember(memberId);
                        const member = members.find(m => m._id === memberId);
                        if (member) {
                          setFormData((prev) => ({
                            ...prev,
                            donorName: member.name,
                            donorPhone: member.phone || '',
                            donorEmail: member.email || '',
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select {formData.donorType}</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} {member.phone ? `(${member.phone})` : ''}
                          {formData.donorType === 'family' && member.familyName ? ` - ${member.familyName}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Donor Name (for external) */}
                {(formData.donorType === 'external') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.donorName}
                      onChange={(e) => handleChange('donorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.donorPhone}
                    onChange={(e) => handleChange('donorPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => handleChange('donorEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="qr">QR Payment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="general">General</option>
                    <option value="temple">Temple</option>
                    <option value="education">Education</option>
                    <option value="emergency">Emergency</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Donation Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Date *
                  </label>
                  <input
                    type="date"
                    value={formData.donationDate}
                    onChange={(e) => handleChange('donationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Anonymous Donation</span>
                </label>

                {formData.paymentMethod === 'qr' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.qrPaymentCompleted}
                      onChange={(e) => handleChange('qrPaymentCompleted', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">QR Payment Completed</span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={mutation.isPending}
                >
                  {mode === 'edit' ? 'Update Donation' : 'Save Donation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationFormModal;