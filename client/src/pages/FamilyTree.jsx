// src/pages/FamilyTree.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilyTree } from '../api/families';
import FamilyTreeView from '../components/FamilyTreeView';
import { useNavigate } from 'react-router-dom';

const FamilyTree = () => {
  const [layout, setLayout] = useState('horizontal');
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['familyTree'],
    queryFn: getFamilyTree,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading family tree</p>
      </div>
    );
  }

  const members = data?.data || [];

  const handleMemberClick = (member) => {
    navigate(`/profile/${member._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
          <p className="text-gray-600">Visual representation of family relationships</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setLayout('horizontal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              layout === 'horizontal'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              layout === 'vertical'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vertical
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <FamilyTreeView 
          members={members} 
          layout={layout}
          onMemberClick={handleMemberClick}
        />
      </div>
    </div>
  );
};

export default FamilyTree;