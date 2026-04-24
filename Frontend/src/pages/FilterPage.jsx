import React, { useState, useEffect } from 'react';
import { getResources } from '../services/resources';
import { toast } from 'react-hot-toast';
import FilterBar from '../components/FilterBar';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FilterPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', location: '' });

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await getResources(filters);
        setResources(data.data || []);
      } catch (error) {
        toast.error('Failed to fetch filtered resources');
        if(resources.length === 0) setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
    // eslint-disable-next-line
  }, [filters]);

  const filteredResources = resources.filter(r => {
    if (filters.location && !r.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-syne font-bold text-white tracking-wide">Advanced Search</h1>
        <p className="text-gray-400 mt-1">Locate specific resources across the network.</p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mt-8">
        <h2 className="text-lg font-syne font-medium text-gray-300 mb-4">
          Search Results ({filteredResources.length})
        </h2>

        {loading && resources.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource._id || resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="glass-card py-20 text-center">
            <h3 className="text-xl font-syne font-bold text-white mb-2">No matching records</h3>
            <p className="text-gray-400">Try loosening your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
