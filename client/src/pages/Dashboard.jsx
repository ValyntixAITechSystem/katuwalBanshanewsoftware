// // src/pages/Dashboard.jsx
// import { useQuery } from '@tanstack/react-query';
// import { getDashboardStats } from '../api/dashboard';
// import StatCard from '../components/StatCard';
// import RecentActivity from '../components/RecentActivity';
// import {
//   UsersIcon,
//   BuildingOfficeIcon,
//   HeartIcon,
//   DocumentIcon,
// } from '@heroicons/react/24/outline';

// const Dashboard = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['dashboardStats'],
//     queryFn: getDashboardStats,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//         Failed to load dashboard data
//       </div>
//     );
//   }

//   const stats = data?.summary || {};
//   const recentMembers = data?.recent?.members || [];
//   const recentDonations = data?.recent?.donations || [];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600">Welcome to Family Tree Management System</p>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Members"
//           value={stats.totalMembers || 0}
//           icon={UsersIcon}
//           color="green"
//         />
//         <StatCard
//           title="Total Families"
//           value={stats.totalFamilies || 0}
//           icon={BuildingOfficeIcon}
//           color="blue"
//         />
//         <StatCard
//           title="Total Donations"
//           value={`Rs. ${(stats.totalDonationAmount || 0).toLocaleString()}`}
//           icon={HeartIcon}
//           color="red"
//         />
//         <StatCard
//           title="Total Documents"
//           value={stats.totalDocuments || 0}
//           icon={DocumentIcon}
//           color="purple"
//         />
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <RecentActivity
//           title="Recent Members"
//           items={recentMembers}
//           type="member"
//         />
//         <RecentActivity
//           title="Recent Donations"
//           items={recentDonations}
//           type="donation"
//         />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// src/pages/Dashboard.jsx - Updated with gender stats
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import {
  UsersIcon,
  BuildingOfficeIcon,
  HeartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load dashboard data
      </div>
    );
  }

  const stats = data?.summary || {};
  const demographics = data?.demographics || {};
  
  // Get gender counts from demographics
  const maleCount = demographics.gender?.find(g => g._id === 'male')?.count || 0;
  const femaleCount = demographics.gender?.find(g => g._id === 'female')?.count || 0;

  const recentMembers = data?.recent?.members || [];
  const recentDonations = data?.recent?.donations || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Family Tree Management System</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers || 0}
          icon={UsersIcon}
          color="green"
        />
        <StatCard
          title="Total Families"
          value={stats.totalFamilies || 0}
          icon={BuildingOfficeIcon}
          color="blue"
        />
        <StatCard
          title="Total Male"
          value={maleCount}
          icon={UserGroupIcon}
          color="indigo"
        />
        <StatCard
          title="Total Female"
          value={femaleCount}
          icon={UserGroupIcon}
          color="pink"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Donations"
          value={`Rs. ${(stats.totalDonationAmount || 0).toLocaleString()}`}
          icon={HeartIcon}
          color="red"
        />
        <StatCard
          title="Living Members"
          value={demographics.lifeStatus?.find(s => s._id === true)?.count || 0}
          icon={UsersIcon}
          color="emerald"
        />
        <StatCard
          title="Generations"
          value={demographics.generations?.length || 0}
          icon={UserGroupIcon}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Members"
          items={recentMembers}
          type="member"
        />
        <RecentActivity
          title="Recent Donations"
          items={recentDonations}
          type="donation"
        />
      </div>
    </div>
  );
};

export default Dashboard;