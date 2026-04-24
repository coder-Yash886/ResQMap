import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, CheckCircle2, Clock, Map as MapIcon, Grid } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getResources } from '../services/resources';
import StatCard from '../components/StatCard';
import ResourceCard from '../components/ResourceCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ResourceChart from '../components/ResourceChart';
import ResourceMap from '../components/ResourceMap';

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', location: '' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getResources(filters);
      setResources(data.data || []);
    } catch (error) {
      toast.error('Failed to connect to command center database');
      if (resources.length === 0) {
          setResources([]); 
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line
  }, [filters]);

  // Derived stats
  const total = resources.length;
  const available = resources.filter(r => r.status === 'available').length;
  const allocated = resources.filter(r => r.status === 'allocated').length;
  const completed = resources.filter(r => r.status === 'completed').length;

  // Filter client-side if the API doesn't support all filters
  const filteredResources = resources.filter(r => {
    if (filters.location && !r.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-syne font-bold text-white tracking-wide">Command Center</h1>
          <p className="text-gray-400 mt-1">Real-time resource allocation and tracking.</p>
        </div>
        <button 
          onClick={fetchResources}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-border transition-colors text-gray-300 shrink-0"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin text-accent-primary' : ''} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Top Section: Stats + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard title="Total Resources" value={total} icon={Package} />
          <StatCard title="Available" value={available} icon={CheckCircle2} trend={available > 0 ? 12 : 0} />
          <StatCard title="Allocated" value={allocated} icon={Clock} />
          <StatCard title="Completed" value={completed} icon={CheckCircle2} />
        </div>
        <div className="lg:col-span-1">
          <ResourceChart resources={filteredResources} />
        </div>
      </div>

      {/* Quick Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Resource View Area */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-syne font-bold text-white">Active Resources</h2>
            <span className="text-sm text-gray-400">Showing {filteredResources.length} results</span>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center bg-dark-base border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-accent-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-accent-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapIcon size={16} /> Map
            </button>
          </div>
        </div>

        {loading && resources.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredResources.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource._id || resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <ResourceMap resources={filteredResources} />
            </div>
          )
        ) : (
          <div className="glass-card py-20 text-center border-dashed border-2">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-dark-base mb-4">
              <Package size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-syne font-bold text-white mb-2">No resources found</h3>
            <p className="text-gray-400">Adjust your filters or register a new resource.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
