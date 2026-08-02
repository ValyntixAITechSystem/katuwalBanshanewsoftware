// src/pages/Donations.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDonations } from '../api/donations';
import Table from '../components/Table';
import QRCodeDisplay from '../components/QRCodeDisplay';

const Donations = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['donations', page],
    queryFn: () => getDonations({ page, limit: 10 }),
  });

  const columns = [
    { key: 'donor', label: 'Donor', type: 'name' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'date', label: 'Date', type: 'date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Track and manage all donations</p>
        </div>
      </div>

      {/* QR Code Display */}
      <QRCodeDisplay />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default Donations;