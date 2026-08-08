import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const DonationFilters = ({ filters, onFilterChange, onSearch }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: '',
      paymentMethod: '',
      category: '',
      paymentStatus: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by donor name, phone, amount, payment method, remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            showAdvanced
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={filters.paymentMethod || ''}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="qr">QR Payment</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="temple">Temple</option>
                <option value="education">Education</option>
                <option value="emergency">Emergency</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus || ''}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationFilters;