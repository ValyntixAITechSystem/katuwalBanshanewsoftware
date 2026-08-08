import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonations, deleteDonation, exportAllDonations, getDonationStats } from '../api/donations';
import Table from '../components/Tablee';
import Button from '../components/Buttons';
import DonationStats from '../components/DonationStats';
import DonationFilters from '../components/DonationFilters';
import DonationFormModal from '../components/DonationFormModal';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { PlusIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Donations = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: '',
    category: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [formMode, setFormMode] = useState('create');

  // Fetch donations with filters
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['donations', page, filters],
    queryFn: () => getDonations({ page, limit: 10, ...filters }),
    keepPreviousData: true,
  });

  // Fetch donation statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['donationStats'],
    queryFn: getDonationStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donationStats'] });
    },
  });

  // Export all donations
  const handleExportAll = async () => {
    try {
      const blob = await exportAllDonations();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donations_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting donations:', error);
    }
  };

  // Export single donation
  const handleExportSingle = async (donation) => {
    try {
      const blob = await exportDonation(donation._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donation_${donation.receiptNumber}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting donation:', error);
    }
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = (donation) => {
    if (window.confirm(`Are you sure you want to delete donation ${donation.receiptNumber}?`)) {
      deleteMutation.mutate(donation._id);
    }
  };

  const handleAddNew = () => {
    setSelectedDonation(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPage(1);
  };

  const columns = [
    {
      key: 'receiptNumber',
      label: 'Receipt #',
      render: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900">
          {value}
        </span>
      ),
    },
    {
      key: 'donorName',
      label: 'Donor',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.donorPhone || 'No phone'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${value?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (value) => {
        const colors = {
          qr: 'bg-purple-100 text-purple-800',
          cash: 'bg-green-100 text-green-800',
          bank_transfer: 'bg-blue-100 text-blue-800',
          cheque: 'bg-yellow-100 text-yellow-800',
        };
        const labels = {
          qr: 'QR',
          cash: 'Cash',
          bank_transfer: 'Bank',
          cheque: 'Cheque',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {labels[value] || value}
          </span>
        );
      },
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="text-sm capitalize">{value || 'General'}</span>
      ),
    },
    {
      key: 'donationDate',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (value) => {
        const colors = {
          completed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          failed: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value?.charAt(0).toUpperCase() + value?.slice(1) || 'Pending'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportSingle(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Export to Excel"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Track and manage all donations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export All
          </Button>
          <Button variant="primary" onClick={handleAddNew}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <DonationStats stats={statsData} isLoading={statsLoading} />

      {/* QR Code Display */}
      <QRCodeDisplay />

      {/* Filters */}
      <DonationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Donation Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
          emptyMessage="No donations found. Start by adding your first donation!"
        />
      </div>

      {/* Donation Form Modal */}
      <DonationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        donation={selectedDonation}
        mode={formMode}
      />
    </div>
  );
};

export default Donations;