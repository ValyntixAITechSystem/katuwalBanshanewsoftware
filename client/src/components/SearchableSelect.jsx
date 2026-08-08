import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronDown, FaTimes } from 'react-icons/fa';

const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Search...',
  required = false,
  icon,
  creatable = false,
  className = '',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Find selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || value || '';

  useEffect(() => {
    // Filter options based on search term
    const filtered = options.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(name, option.value);
    setIsOpen(false);
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && creatable && searchTerm.trim()) {
      // Create new option
      const newOption = { value: searchTerm.trim(), label: searchTerm.trim() };
      onChange(name, newOption.value);
      setIsOpen(false);
      setSearchTerm('');
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange(name, '');
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {React.createElement(icon, { className: 'h-4 w-4' })}
          </div>
        )}
        <div
          className={`
            w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer
            ${icon ? 'pl-9' : 'pl-3'}
            ${isOpen ? 'border-green-500 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          ref={inputRef}
        >
          <div className="flex items-center justify-between">
            <span className={`truncate ${displayValue ? 'text-gray-800' : 'text-gray-400'}`}>
              {displayValue || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {displayValue && !disabled && (
                <button
                  onClick={clearSelection}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <FaTimes className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              <FaChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      px-3 py-2 text-sm cursor-pointer hover:bg-green-50 transition-colors
                      ${value === option.value ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'}
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              ) : creatable && searchTerm.trim() ? (
                <div
                  className="px-3 py-2 text-sm text-green-600 cursor-pointer hover:bg-green-50 transition-colors flex items-center gap-2"
                  onClick={() => {
                    const newOption = { value: searchTerm.trim(), label: searchTerm.trim() };
                    onChange(name, newOption.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span>Create "{searchTerm}"</span>
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;