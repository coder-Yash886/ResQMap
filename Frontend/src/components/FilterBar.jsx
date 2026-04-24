import React from 'react';
import { Search, X } from 'lucide-react';
import { RESOURCE_TYPES, STATUS_OPTIONS } from '../utils/constants';

const FilterBar = ({ filters, onChange }) => {
  const handleTypeToggle = (type) => {
    if (type === 'all') {
      onChange({ ...filters, type: '' });
    } else {
      onChange({ ...filters, type });
    }
  };

  const clearAll = () => {
    onChange({ type: '', status: '', location: '' });
  };

  const hasFilters = filters.type || filters.status || filters.location;

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Type Filter Chips */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeToggle('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                !filters.type 
                  ? 'bg-accent-primary text-white border-accent-primary' 
                  : 'bg-dark-base text-gray-400 border-dark-border hover:border-gray-500'
              }`}
            >
              All Types
            </button>
            {RESOURCE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border capitalize ${
                  filters.type === type 
                    ? 'bg-accent-secondary text-white border-accent-secondary' 
                    : 'bg-dark-base text-gray-400 border-dark-border hover:border-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 lg:w-1/2">
          {/* Status Dropdown */}
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="input-field py-1.5 sm:w-1/3 appearance-none capitalize"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Location Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by location..."
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              className="input-field pl-10 py-1.5"
            />
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-white transition-colors py-1.5 px-3"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
