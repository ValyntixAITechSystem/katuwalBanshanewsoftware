// // src/pages/Reports.jsx
// import { useState } from 'react';
// import {
//   generateGenealogyReport,
//   generateFamilyReport,
//   generateGenerationReport,
//   generateDonationReport,
//   generateDemographicReport,
// } from '../api/reports';
// import Button from '../components/Button';
// import toast from 'react-hot-toast';

// const Reports = () => {
//   const [loading, setLoading] = useState({});

//   const downloadReport = async (generator, filename, params = {}) => {
//     const key = filename;
//     setLoading((prev) => ({ ...prev, [key]: true }));

//     try {
//       const blob = await generator(params);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${filename}.${params.format === 'csv' ? 'csv' : 'xlsx'}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success('Report downloaded successfully');
//     } catch (error) {
//       toast.error('Failed to generate report');
//     } finally {
//       setLoading((prev) => ({ ...prev, [key]: false }));
//     }
//   };

//   const reportTypes = [
//     {
//       id: 'genealogy',
//       title: 'Genealogy Report',
//       description: 'Complete family genealogy with all members',
//       generator: generateGenealogyReport,
//     },
//     {
//       id: 'family',
//       title: 'Family Report',
//       description: 'Detailed report of all families',
//       generator: generateFamilyReport,
//     },
//     {
//       id: 'generation',
//       title: 'Generation Report',
//       description: 'Statistics by generation',
//       generator: generateGenerationReport,
//     },
//     {
//       id: 'donation',
//       title: 'Donation Report',
//       description: 'All donations with summary',
//       generator: generateDonationReport,
//     },
//     {
//       id: 'demographic',
//       title: 'Demographic Report',
//       description: 'Demographic statistics and analysis',
//       generator: generateDemographicReport,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
//         <p className="text-gray-600">Generate and download various reports</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reportTypes.map((report) => (
//           <div
//             key={report.id}
//             className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//           >
//             <h3 className="text-lg font-semibold text-gray-900">
//               {report.title}
//             </h3>
//             <p className="text-sm text-gray-600 mt-2">{report.description}</p>
//             <div className="mt-4 flex space-x-2">
//               <Button
//                 variant="primary"
//                 size="sm"
//                 onClick={() =>
//                   downloadReport(report.generator, report.id, { format: 'excel' })
//                 }
//                 disabled={loading[report.id]}
//               >
//                 {loading[report.id] ? 'Generating...' : 'Excel'}
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   downloadReport(report.generator, report.id, { format: 'csv' })
//                 }
//                 disabled={loading[report.id]}
//               >
//                 {loading[report.id] ? 'Generating...' : 'CSV'}
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reports;


// src/pages/Reports.jsx
import { useState } from 'react';
import {
  generateGenealogyReport,
  generateFamilyReport,
  generateGenerationReport,
  generateDonationReport,
  generateDemographicReport,
} from '../api/reports';
import { getMembers } from '../api/members';
import { getFamilies } from '../api/families';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/Button';
import Select from 'react-select';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loading, setLoading] = useState({});
  const [filters, setFilters] = useState({
    family: '',
    generation: '',
    gender: '',
    district: '',
    province: '',
    status: '',
    verificationStatus: '',
    format: 'excel',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
  });

  const { data: familiesData } = useQuery({
    queryKey: ['families-dropdown'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  const memberOptions = (membersData?.data || []).map(m => ({
    value: m._id,
    label: `${m.name} (${m.familyNumber || 'No Family'})`,
  }));

  const familyOptions = (familiesData?.data || []).map(f => ({
    value: f._id,
    label: `${f.familyName} (${f.familyNumber})`,
  }));

  const downloadReport = async (generator, filename, params = {}) => {
    const key = filename;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const blob = await generator({ 
        ...params,
        ...filters,
        format: filters.format 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${filters.format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const reportTypes = [
    {
      id: 'genealogy',
      title: 'Genealogy Report',
      description: 'Complete family genealogy with all members',
      generator: generateGenealogyReport,
      supportsFilters: true,
    },
    {
      id: 'family',
      title: 'Family Report',
      description: 'Detailed report of all families',
      generator: generateFamilyReport,
      supportsFilters: true,
    },
    {
      id: 'generation',
      title: 'Generation Report',
      description: 'Statistics by generation',
      generator: generateGenerationReport,
      supportsFilters: false,
    },
    {
      id: 'donation',
      title: 'Donation Report',
      description: 'All donations with summary',
      generator: generateDonationReport,
      supportsFilters: false,
    },
    {
      id: 'demographic',
      title: 'Demographic Report',
      description: 'Demographic statistics and analysis',
      generator: generateDemographicReport,
      supportsFilters: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and download various reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.format}
            onChange={(e) => setFilters({ ...filters, format: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family</label>
              <Select
                options={familyOptions}
                value={familyOptions.find(opt => opt.value === filters.family)}
                onChange={(opt) => setFilters({ ...filters, family: opt?.value || '' })}
                placeholder="Select Family"
                isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generation</label>
              <select
                value={filters.generation}
                onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Generations</option>
                {[1,2,3,4,5,6,7,8,9,10].map(gen => (
                  <option key={gen} value={gen}>Generation {gen}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                placeholder="Filter by district"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <input
                type="text"
                value={filters.province}
                onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                placeholder="Filter by province"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                value={filters.verificationStatus}
                onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{report.description}</p>
            {report.supportsFilters && showFilters && (
              <p className="text-xs text-gray-500 mt-1">Filters will be applied</p>
            )}
            <div className="mt-4 flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  downloadReport(report.generator, report.id)
                }
                disabled={loading[report.id]}
              >
                {loading[report.id] ? 'Generating...' : `Download ${filters.format.toUpperCase()}`}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;