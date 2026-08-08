// // src/pages/FamilyTree.jsx
// import { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaSearch, FaUsers, FaTree, FaHome, FaUser } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import FamilyTreeView from '../components/FamilyTreeView';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'tree'
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family - ONLY ONE DECLARATION
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setViewMode('tree');
//   };

//   const handleBackToGrid = () => {
//     setSelectedFamily(null);
//     setViewMode('grid');
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

//   // Render family card
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const headOfFamily = family.headOfFamily || {};

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className="text-white text-3xl" />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <h3 className="font-bold text-lg text-gray-800 truncate">
//             {family.familyName || 'Unnamed Family'}
//           </h3>
//           <p className="text-sm text-gray-500">
//             House No. {family.familyNumber || 'N/A'}
//           </p>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className="text-green-500 text-sm" />
//               <span className="text-sm font-medium text-gray-700">{memberCount} Members</span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className="text-xs text-green-600 font-medium flex items-center gap-1">
//               <FaTree className="text-xs" />
//               Open Tree
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading families...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             Family Tree
//           </h1>
//           <p className="text-gray-600">Browse and explore family trees</p>
//         </div>
        
//         {viewMode === 'tree' && selectedFamily && (
//           <button
//             onClick={handleBackToGrid}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
//           >
//             <FaHome className="text-sm" />
//             Back to Families
//           </button>
//         )}
//       </div>

//       {viewMode === 'grid' ? (
//         <>
//           {/* Search Bar */}
//           <div className="relative max-w-md">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search Family by Name, Number, or Clan..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>

//           {/* Family Grid */}
//           {filteredFamilies.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//               <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">No families found</p>
//               <p className="text-sm text-gray-400">Try adjusting your search</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredFamilies.map((family) => (
//                 <FamilyCard key={family._id} family={family} />
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         // Tree View
//         selectedFamily && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
//                   {selectedFamily.familyPhoto ? (
//                     <img 
//                       src={selectedFamily.familyPhoto} 
//                       alt={selectedFamily.familyName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-green-200 flex items-center justify-center">
//                       <FaHome className="text-green-600" />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {selectedFamily.familyName}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     House No. {selectedFamily.familyNumber} • {getFamilyMemberCount(selectedFamily._id)} Members
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 min-h-[500px]">
//               {treeLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                 </div>
//               ) : (
//                 <FamilyTreeView 
//                   members={treeData?.data || []} 
//                   layout="horizontal"
//                   onMemberClick={handleMemberClick}
//                   familyId={selectedFamily._id}
//                 />
//               )}
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default FamilyTreePage;





import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilies, getFamilyTreeByFamily } from '../api/families';
import { getMembers } from '../api/members';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUsers, FaTree, FaHome, FaUser } from 'react-icons/fa';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import FamilyTreeView from '../components/FamilyTreeView';
import Modal from '../components/Modal';

const FamilyTreePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch all families
  const { data: familiesData, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  // Fetch all members for tree generation
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-tree'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  // Get family tree data for selected family
  const { data: treeData, isLoading: treeLoading } = useQuery({
    queryKey: ['familyTree', selectedFamily?._id],
    queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
    enabled: !!selectedFamily,
  });

  // Filter families by search
  const filteredFamilies = useMemo(() => {
    if (!familiesData?.data) return [];
    if (!searchTerm) return familiesData.data;
    
    const search = searchTerm.toLowerCase();
    return familiesData.data.filter(family => 
      family.familyName?.toLowerCase().includes(search) ||
      family.familyNumber?.toLowerCase().includes(search) ||
      family.clan?.toLowerCase().includes(search)
    );
  }, [familiesData, searchTerm]);

  // Get members count per family
  const getFamilyMemberCount = (familyId) => {
    if (!membersData?.data) return 0;
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
  };

  const handleFamilyClick = (family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFamily(null);
  };

  const handleMemberClick = (member) => {
    navigate(`/profile/${member._id}`);
  };

  // Render family card
  const FamilyCard = ({ family }) => {
    const memberCount = getFamilyMemberCount(family._id);
    const headOfFamily = family.headOfFamily || {};

    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleFamilyClick(family)}
      >
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              {family.familyPhoto ? (
                <img 
                  src={family.familyPhoto} 
                  alt={family.familyName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaHome className="text-white text-3xl" />
              )}
            </div>
          </div>
          
          {family.familyPhoto && (
            <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img 
                src={family.familyPhoto} 
                alt={family.familyName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="pt-8 pb-4 px-4">
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {family.familyName || 'Unnamed Family'}
          </h3>
          <p className="text-sm text-gray-500">
            House No. {family.familyNumber || 'N/A'}
          </p>
          
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <FaUsers className="text-green-500 text-sm" />
              <span className="text-sm font-medium text-gray-700">{memberCount} Members</span>
            </div>
            {family.clan && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {family.clan}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <FaTree className="text-xs" />
              Open Tree
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (familiesLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading families...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaTree className="text-green-500" />
            Family Tree
          </h1>
          <p className="text-gray-600">Browse and explore family trees</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Family by Name, Number, or Clan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Family Grid */}
      {filteredFamilies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No families found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFamilies.map((family) => (
            <FamilyCard key={family._id} family={family} />
          ))}
        </div>
      )}

      {/* Family Tree Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedFamily?.familyName || 'Family Tree'}
        size="xl"
      >
        {selectedFamily && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow">
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
                  House No. {selectedFamily.familyNumber} • {getFamilyMemberCount(selectedFamily._id)} Members
                </p>
              </div>
            </div>

            <div className="min-h-[400px] max-h-[70vh] overflow-auto">
              {treeLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <FamilyTreeView 
                  members={treeData?.data || []} 
                  layout="horizontal"
                  onMemberClick={handleMemberClick}
                  familyId={selectedFamily._id}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FamilyTreePage;