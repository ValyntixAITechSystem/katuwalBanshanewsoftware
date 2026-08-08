// // src/pages/Reports.jsx - Updated version with modal
// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyById } from '../api/families';
// import { getMembers } from '../api/members';
// import { generateFamilyReport } from '../api/reports';
// import Button from '../components/Button';
// import Modal from '../components/Modal';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import { 
//   FaUsers, FaHome, FaFileExcel, FaTimes, FaChartBar, 
//   FaUser, FaUserFriends, FaHeart, FaDownload 
// } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// const Reports = () => {
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [exporting, setExporting] = useState(false);

//   // Fetch families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families-report'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch family details when selected
//   const { data: familyDetails, isLoading: familyLoading } = useQuery({
//     queryKey: ['family', selectedFamily?._id],
//     queryFn: () => getFamilyById(selectedFamily?._id),
//     enabled: !!selectedFamily,
//   });

//   // Fetch all members for statistics
//   const { data: membersData } = useQuery({
//     queryKey: ['members-stats'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   const filteredFamilies = familiesData?.data?.filter(family => 
//     family.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     family.familyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     family.clan?.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setIsModalOpen(true);
//   };

//   const handleExportExcel = async () => {
//     if (!selectedFamily) return;
    
//     setExporting(true);
//     try {
//       const blob = await generateFamilyReport({ 
//         familyId: selectedFamily._id,
//         format: 'excel'
//       });
      
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `family-report-${selectedFamily.familyName}-${Date.now()}.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Report exported successfully');
//     } catch (error) {
//       toast.error('Failed to export report');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Family Card Component
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
    
//     return (
//       <motion.div
//         whileHover={{ y: -4 }}
//         className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="flex items-start gap-4">
//           <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
//             {family.familyPhoto ? (
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover rounded-xl"
//               />
//             ) : (
//               <FaHome className="text-green-600 text-2xl" />
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-800 truncate">
//               {family.familyName || 'Unnamed Family'}
//             </h3>
//             <p className="text-sm text-gray-500">
//               House No. {family.familyNumber || 'N/A'}
//             </p>
//             <div className="flex items-center gap-3 mt-1">
//               <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
//                 {memberCount} Members
//               </span>
//               {family.clan && (
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Report Modal
//   const ReportModal = () => {
//     if (!selectedFamily || !familyDetails) return null;

//     const members = familyDetails.members || [];
//     const maleCount = members.filter(m => m.gender === 'male').length;
//     const femaleCount = members.filter(m => m.gender === 'female').length;
//     const livingCount = members.filter(m => m.isAlive !== false).length;

//     return (
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedFamily(null);
//         }}
//         title="Family Report"
//         size="xl"
//       >
//         <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
//           {/* Family Information */}
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
//                 {selectedFamily.familyPhoto ? (
//                   <img 
//                     src={selectedFamily.familyPhoto} 
//                     alt={selectedFamily.familyName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-green-200 flex items-center justify-center">
//                     <FaHome className="text-green-600 text-2xl" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {selectedFamily.familyName}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   House No. {selectedFamily.familyNumber}
//                 </p>
//                 {selectedFamily.clan && (
//                   <p className="text-sm text-gray-500">Clan: {selectedFamily.clan}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Statistics */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
//               <FaUsers className="text-blue-500 text-xl mx-auto mb-1" />
//               <p className="text-2xl font-bold text-gray-800">{members.length}</p>
//               <p className="text-xs text-gray-500">Total Members</p>
//             </div>
//             <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
//               <FaUser className="text-blue-500 text-xl mx-auto mb-1" />
//               <p className="text-2xl font-bold text-gray-800">{maleCount}</p>
//               <p className="text-xs text-gray-500">Male</p>
//             </div>
//             <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
//               <FaUserFriends className="text-pink-500 text-xl mx-auto mb-1" />
//               <p className="text-2xl font-bold text-gray-800">{femaleCount}</p>
//               <p className="text-xs text-gray-500">Female</p>
//             </div>
//             <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
//               <FaHeart className="text-red-500 text-xl mx-auto mb-1" />
//               <p className="text-2xl font-bold text-gray-800">{livingCount}</p>
//               <p className="text-xs text-gray-500">Living</p>
//             </div>
//           </div>

//           {/* Member List */}
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-3">Member List</h4>
//             <div className="border border-gray-200 rounded-xl overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Gender</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Generation</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {members.map((member, index) => (
//                     <tr key={member._id || index} className="hover:bg-gray-50">
//                       <td className="px-4 py-2 font-medium text-gray-700">{member.name}</td>
//                       <td className="px-4 py-2 text-gray-600 capitalize">{member.gender}</td>
//                       <td className="px-4 py-2 text-gray-600">{member.generation || 'N/A'}</td>
//                       <td className="px-4 py-2">
//                         <span className={`px-2 py-0.5 rounded-full text-xs ${
//                           member.isAlive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//                         }`}>
//                           {member.isAlive !== false ? 'Living' : 'Deceased'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
//             <Button
//               variant="primary"
//               onClick={handleExportExcel}
//               disabled={exporting}
//               className="flex items-center"
//             >
//               <FaFileExcel className="mr-2" />
//               {exporting ? 'Exporting...' : 'Export Excel'}
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsModalOpen(false);
//                 setSelectedFamily(null);
//               }}
//               className="flex items-center"
//             >
//               <FaTimes className="mr-2" />
//               Close
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     );
//   };

//   if (familiesLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
//           <p className="text-gray-600">View and export family reports</p>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-md">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search families..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         />
//       </div>

//       {/* Family Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredFamilies.length === 0 ? (
//           <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
//             <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//             <p className="text-gray-500">No families found</p>
//           </div>
//         ) : (
//           filteredFamilies.map((family) => (
//             <FamilyCard key={family._id} family={family} />
//           ))
//         )}
//       </div>

//       {/* Report Modal */}
//       <ReportModal />
//     </div>
//   );
// };

// export default Reports;
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilies, getFamilyById } from '../api/families';
import { getMembers } from '../api/members';
import { generateFamilyReport } from '../api/reports';
import Button from '../components/Button';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaHome, FaFileExcel, FaTimes, FaChartBar, 
  FaUser, FaUserFriends, FaHeart, FaDownload 
} from 'react-icons/fa';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Reports = () => {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  // Fetch families
  const { data: familiesData, isLoading: familiesLoading } = useQuery({
    queryKey: ['families-report'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  // Fetch family details when selected
  const { data: familyDetails, isLoading: familyLoading } = useQuery({
    queryKey: ['family', selectedFamily?._id],
    queryFn: () => getFamilyById(selectedFamily?._id),
    enabled: !!selectedFamily,
  });

  // Fetch all members for statistics
  const { data: membersData } = useQuery({
    queryKey: ['members-stats'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  const filteredFamilies = familiesData?.data?.filter(family => 
    family.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.familyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.clan?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getFamilyMemberCount = (familyId) => {
    if (!membersData?.data) return 0;
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
  };

  const handleFamilyClick = (family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
  };

  const handleExportExcel = async () => {
    if (!selectedFamily) return;
    
    setExporting(true);
    try {
      const blob = await generateFamilyReport({ 
        familyId: selectedFamily._id,
        format: 'excel'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `family-report-${selectedFamily.familyName}-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  // Family Card Component
  const FamilyCard = ({ family }) => {
    const memberCount = getFamilyMemberCount(family._id);
    
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleFamilyClick(family)}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
            {family.familyPhoto ? (
              <img 
                src={family.familyPhoto} 
                alt={family.familyName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <FaHome className="text-green-600 text-2xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">
              {family.familyName || 'Unnamed Family'}
            </h3>
            <p className="text-sm text-gray-500">
              House No. {family.familyNumber || 'N/A'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {memberCount} Members
              </span>
              {family.clan && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {family.clan}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Report Modal
  const ReportModal = () => {
    if (!selectedFamily || !familyDetails) return null;

    const members = familyDetails.members || [];
    const maleCount = members.filter(m => m.gender === 'male').length;
    const femaleCount = members.filter(m => m.gender === 'female').length;
    const livingCount = members.filter(m => m.isAlive !== false).length;

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFamily(null);
        }}
        title="Family Report"
        size="xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
          {/* Family Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                {selectedFamily.familyPhoto ? (
                  <img 
                    src={selectedFamily.familyPhoto} 
                    alt={selectedFamily.familyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-200 flex items-center justify-center">
                    <FaHome className="text-green-600 text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedFamily.familyName}
                </h3>
                <p className="text-sm text-gray-600">
                  House No. {selectedFamily.familyNumber}
                </p>
                {selectedFamily.clan && (
                  <p className="text-sm text-gray-500">Clan: {selectedFamily.clan}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <FaUsers className="text-blue-500 text-xl mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{members.length}</p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <FaUser className="text-blue-500 text-xl mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{maleCount}</p>
              <p className="text-xs text-gray-500">Male</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <FaUserFriends className="text-pink-500 text-xl mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{femaleCount}</p>
              <p className="text-xs text-gray-500">Female</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <FaHeart className="text-red-500 text-xl mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{livingCount}</p>
              <p className="text-xs text-gray-500">Living</p>
            </div>
          </div>

          {/* Member List */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Member List</h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Member ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Gender</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Generation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((member, index) => (
                    <tr key={member._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs font-mono text-gray-500">{member.memberNumber || 'N/A'}</td>
                      <td className="px-4 py-2 font-medium text-gray-700">{member.name}</td>
                      <td className="px-4 py-2 text-gray-600 capitalize">{member.gender}</td>
                      <td className="px-4 py-2 text-gray-600">{member.generation || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          member.isAlive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {member.isAlive !== false ? 'Living' : 'Deceased'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buttons - Only Excel */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleExportExcel}
              disabled={exporting}
              className="flex items-center"
            >
              <FaFileExcel className="mr-2" />
              {exporting ? 'Exporting...' : 'Export Excel'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFamily(null);
              }}
              className="flex items-center"
            >
              <FaTimes className="mr-2" />
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  if (familiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">View and export family reports</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search families..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Family Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No families found</p>
          </div>
        ) : (
          filteredFamilies.map((family) => (
            <FamilyCard key={family._id} family={family} />
          ))
        )}
      </div>

      {/* Report Modal */}
      <ReportModal />
    </div>
  );
};

export default Reports;