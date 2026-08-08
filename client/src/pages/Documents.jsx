// src/pages/Documents.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, uploadDocument, deleteDocument, verifyDocument } from '../api/documents';
import { getMembers } from '../api/members';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DocumentUpload from '../components/DocumentUpload';
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Documents = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['documents', page, selectedMember],
    queryFn: () => getDocuments({ page, limit: 10, memberId: selectedMember }),
  });

  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document verified successfully');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleVerify = (id) => {
    verifyMutation.mutate(id);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'documentType', label: 'Type' },
    { key: 'member', label: 'Member', type: 'member' },
    { key: 'isVerified', label: 'Verified', type: 'verified' },
    { key: 'createdAt', label: 'Uploaded', type: 'date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage all uploaded documents</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center shadow-lg shadow-green-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <select
            value={selectedMember}
            onChange={(e) => {
              setSelectedMember(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Members</option>
            {membersData?.data?.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          onDelete={handleDelete}
          customActions={(item) => (
            <>
              {!item.isVerified && (
                <button
                  onClick={() => handleVerify(item._id)}
                  className="text-green-600 hover:text-green-900 mr-3"
                  title="Verify"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
            </>
          )}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Document"
        size="md"
      >
        <DocumentUpload
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['documents'] });
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Documents;