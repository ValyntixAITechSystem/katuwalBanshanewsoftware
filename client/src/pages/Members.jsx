// // // src/pages/Members.jsx
// // import { useState } from 'react';
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { getMembers, deleteMember } from '../api/members';
// // import Table from '../components/Table';
// // import Button from '../components/Button';
// // import Modal from '../components/Modal';
// // import MemberForm from '../components/MemberForm';
// // import { PlusIcon } from '@heroicons/react/24/outline';
// // import toast from 'react-hot-toast';

// // const Members = () => {
// //   const [page, setPage] = useState(1);
// //   const [search, setSearch] = useState('');
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [editingMember, setEditingMember] = useState(null);
// //   const queryClient = useQueryClient();

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ['members', page, search],
// //     queryFn: () => getMembers({ page, limit: 10, search }),
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: deleteMember,
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['members'] });
// //       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
// //       toast.success('Member deleted successfully');
// //     },
// //   });

// //   const handleDelete = (id) => {
// //     if (window.confirm('Are you sure you want to delete this member?')) {
// //       deleteMutation.mutate(id);
// //     }
// //   };

// //   const handleEdit = (member) => {
// //     setEditingMember(member);
// //     setIsModalOpen(true);
// //   };

// //   const handleModalClose = () => {
// //     setIsModalOpen(false);
// //     setEditingMember(null);
// //   };

// //   const columns = [
// //     { key: 'photo', label: 'Photo', type: 'image' },
// //     { key: 'name', label: 'Name', sortable: true },
// //     { key: 'familyNumber', label: 'Family Number' },
// //     { key: 'generation', label: 'Generation' },
// //     { key: 'gender', label: 'Gender' },
// //     { key: 'isAlive', label: 'Status', type: 'status' },
// //   ];

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Members</h1>
// //           <p className="text-gray-600">Manage all family members</p>
// //         </div>
// //         <Button
// //           onClick={() => setIsModalOpen(true)}
// //           className="flex items-center"
// //         >
// //           <PlusIcon className="h-5 w-5 mr-2" />
// //           Add Member
// //         </Button>
// //       </div>

// //       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //         <div className="p-4 border-b border-gray-200">
// //           <input
// //             type="text"
// //             placeholder="Search members..."
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //             className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //           />
// //         </div>

// //         <Table
// //           columns={columns}
// //           data={data?.data || []}
// //           loading={isLoading}
// //           onEdit={handleEdit}
// //           onDelete={handleDelete}
// //           pagination={{
// //             currentPage: data?.pagination?.page || 1,
// //             totalPages: data?.pagination?.pages || 1,
// //             onPageChange: setPage,
// //           }}
// //         />
// //       </div>

// //       <Modal
// //         isOpen={isModalOpen}
// //         onClose={handleModalClose}
// //         title={editingMember ? 'Edit Member' : 'Add New Member'}
// //       >
// //         <MemberForm
// //           member={editingMember}
// //           onSuccess={() => {
// //             handleModalClose();
// //             queryClient.invalidateQueries({ queryKey: ['members'] });
// //             queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
// //           }}
// //         />
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Members;

// // src/pages/Members.jsx
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getMembers, deleteMember } from '../api/members';
// import Table from '../components/Table';
// import Button from '../components/Button';
// import Modal from '../components/Modal';
// import MemberProfile from './MemberProfile';
// import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';
// import MemberForm from "../pages/DataEntry";

// const Members = () => {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [filters, setFilters] = useState({
//     gender: '',
//     status: '',
//     generation: '',
//     verificationStatus: '',
//     family: '',
//     district: '',
//     province: '',
//   });
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [editingMember, setEditingMember] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const queryClient = useQueryClient();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['members', page, search, filters],
//     queryFn: () => getMembers({ 
//       page, 
//       limit: 10, 
//       search,
//       ...filters 
//     }),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteMember,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       toast.success('Member deleted successfully');
//     },
//   });

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this member?')) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const handleView = (member) => {
//     setSelectedMember(member);
//     setIsProfileOpen(true);
//   };

//   const handleEdit = (member) => {
//     setEditingMember(member);
//     setIsEditModalOpen(true);
//   };

//   const handleExport = async () => {
//     try {
//       const response = await getMembers({ 
//         ...filters,
//         search,
//         limit: 10000,
//         export: true 
//       });
//       // Handle export logic
//       toast.success('Export initiated');
//     } catch (error) {
//       toast.error('Failed to export');
//     }
//   };

//   const columns = [
//     { key: 'photo', label: 'Photo', type: 'image' },
//     { key: 'name', label: 'Name', sortable: true },
//     { key: 'familyNumber', label: 'Family Number' },
//     { key: 'rollNumber', label: 'Roll Number' },
//     { key: 'generation', label: 'Generation' },
//     { key: 'gender', label: 'Gender' },
//     { key: 'phone', label: 'Phone' },
//     { key: 'email', label: 'Email' },
//     { key: 'isAlive', label: 'Status', type: 'status' },
//     { key: 'verificationStatus', label: 'Verification', type: 'verification' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Members</h1>
//           <p className="text-gray-600">View and manage all family members</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             onClick={handleExport}
//             className="flex items-center"
//           >
//             <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
//             Export
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="flex items-center"
//           >
//             <FunnelIcon className="h-5 w-5 mr-2" />
//             Filter
//           </Button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Name, Phone, Email, Family Number, Roll Number, Citizenship Number..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Advanced Filters */}
//         {isFilterOpen && (
//           <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50">
//             <select
//               value={filters.gender}
//               onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">All Genders</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
            
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="deceased">Deceased</option>
//             </select>

//             <select
//               value={filters.generation}
//               onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">All Generations</option>
//               {[1,2,3,4,5,6,7,8,9,10].map(gen => (
//                 <option key={gen} value={gen}>Generation {gen}</option>
//               ))}
//             </select>

//             <select
//               value={filters.verificationStatus}
//               onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             >
//               <option value="">All Verification</option>
//               <option value="verified">Verified</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         )}

//         <Table
//           columns={columns}
//           data={data?.data || []}
//           loading={isLoading}
//           onView={handleView}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           pagination={{
//             currentPage: data?.pagination?.page || 1,
//             totalPages: data?.pagination?.pages || 1,
//             onPageChange: setPage,
//           }}
//         />
//       </div>

//       {/* Member Profile Modal */}
//       <Modal
//         isOpen={isProfileOpen}
//         onClose={() => {
//           setIsProfileOpen(false);
//           setSelectedMember(null);
//         }}
//         title="Member Profile"
//         size="xl"
//       >
//         {selectedMember && <MemberProfile member={selectedMember} />}
//       </Modal>

//       {/* Edit Member Modal */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={() => {
//           setIsEditModalOpen(false);
//           setEditingMember(null);
//         }}
//         title="Edit Member"
//         size="xl"
//       >
//         <MemberForm
//           member={editingMember}
//           onSuccess={() => {
//             setIsEditModalOpen(false);
//             setEditingMember(null);
//             queryClient.invalidateQueries({ queryKey: ['members'] });
//             queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default Members;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, deleteMember } from '../api/members';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import MemberProfile from '../components/MemberProfile';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import MemberForm from "../pages/DataEntry";

const Members = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    status: '',
    generation: '',
    verificationStatus: '',
    family: '',
    district: '',
    province: '',
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['members', page, search, filters],
    queryFn: () => getMembers({ 
      page, 
      limit: 10, 
      search,
      ...filters 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Member deleted successfully');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleExport = async () => {
    try {
      const response = await getMembers({ 
        ...filters,
        search,
        limit: 10000,
        export: true 
      });
      toast.success('Export initiated');
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  const columns = [
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'memberNumber', label: 'Member ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'familyNumber', label: 'Family Number' },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'generation', label: 'Generation' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'isAlive', label: 'Status', type: 'status' },
    { key: 'verificationStatus', label: 'Verification', type: 'verification' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600">View and manage all family members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Member ID, Phone, Email, Family Number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50">
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deceased">Deceased</option>
            </select>

            <select
              value={filters.generation}
              onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Generations</option>
              {[1,2,3,4,5,6,7,8,9,10].map(gen => (
                <option key={gen} value={gen}>Generation {gen}</option>
              ))}
            </select>

            <select
              value={filters.verificationStatus}
              onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}

        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </div>

      {/* Member Profile Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedMember(null);
        }}
        title="Member Profile"
        size="xl"
      >
        {selectedMember && <MemberProfile member={selectedMember} />}
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }}
        title="Edit Member"
        size="xl"
      >
        <MemberForm
          member={editingMember}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
            queryClient.invalidateQueries({ queryKey: ['members'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
          }}
        />
      </Modal>
    </div>
  );
};

export default Members;