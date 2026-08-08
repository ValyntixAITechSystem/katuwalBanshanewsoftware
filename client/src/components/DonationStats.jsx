import React from 'react';
import { formatCurrency } from '../utils/formatters';

const DonationStats = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const summary = stats?.summary || {};
  const totalDonations = summary.count || 0;
  const totalAmount = summary.totalAmount || 0;
  const pendingCount = summary.pendingCount || 0;
  const monthlyTotal = stats?.monthly?.[stats.monthly.length - 1]?.total || 0;

  const statsData = [
    {
      label: 'Total Donations',
      value: totalDonations,
      format: 'number',
      color: 'blue',
    },
    {
      label: 'Total Amount',
      value: totalAmount,
      format: 'currency',
      color: 'green',
    },
    {
      label: 'This Month',
      value: monthlyTotal,
      format: 'currency',
      color: 'purple',
    },
    {
      label: 'Pending Donations',
      value: pendingCount,
      format: 'number',
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${colorClasses[stat.color]} rounded-lg border p-6 transition-all hover:shadow-md`}
        >
          <p className="text-sm font-medium mb-1">{stat.label}</p>
          <p className="text-2xl font-bold">
            {stat.format === 'currency' ? formatCurrency(stat.value) : stat.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DonationStats;