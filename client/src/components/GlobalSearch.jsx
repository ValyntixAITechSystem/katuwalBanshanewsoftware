// src/components/GlobalSearch.jsx - New component for global search
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../api/members';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['search-members', searchTerm],
    queryFn: () => getMembers({ search: searchTerm, limit: 10 }),
    enabled: searchTerm.length > 1,
  });

  useEffect(() => {
    if (data?.data) {
      setResults(data.data);
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleResultClick = (member) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/profile/${member._id}`);
  };

  const getSearchPlaceholder = () => {
    const placeholders = [
      'Search by Member Number...',
      'Search by Name...',
      'Search by Phone...',
      'Search by Family Number...'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
        />
      </div>

      <AnimatePresence>
        {isOpen && searchTerm.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-sm mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                {results.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => handleResultClick(member)}
                  >
                    <img
                      src={member.photo || '/default-avatar.png'}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {member.memberNumber && (
                          <span>#{member.memberNumber}</span>
                        )}
                        {member.familyNumber && (
                          <span>• Family #{member.familyNumber}</span>
                        )}
                        {member.phone && (
                          <span>• {member.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No results found for "{searchTerm}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;