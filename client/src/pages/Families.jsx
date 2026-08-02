// src/pages/Families.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilies } from '../api/families';
import Table from '../components/Table';

const Families = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['families', page, search],
    queryFn: () => getFamilies({ page, limit: 10, search }),
  });

  const columns = [
    { key: 'familyPhoto', label: 'Photo', type: 'image' },
    { key: 'familyName', label: 'Family Name' },
    { key: 'familyNumber', label: 'Family Number' },
    { key: 'clan', label: 'Clan' },
    { key: 'totalMembers', label: 'Total Members' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Families</h1>
          <p className="text-gray-600">Manage all families</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search families..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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

export default Families;