import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { ArrowLeft, MapPin, AlignLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { getResourceById, updateStatus } from '../services/resources';
import { TYPE_ICONS, STATUS_OPTIONS } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResourceById(id);
        if (data && data.data) {
          setResource(data.data);
          setSelectedStatus(data.data.status);
        } else {
            // mock if no backend
            toast.error('Could not find resource details');
            navigate('/');
        }
      } catch (error) {
        toast.error('Resource not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (selectedStatus === resource.status) return;

    setStatusLoading(true);
    try {
      await updateStatus(id, selectedStatus);
      setResource(prev => ({ ...prev, status: selectedStatus }));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      setSelectedStatus(resource.status); // revert
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm tracking-wide uppercase">Back to Dashboard</span>
      </button>

      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-dark-border relative bg-gradient-to-r from-dark-surface to-transparent">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl bg-dark-base p-3 rounded-xl border border-dark-border" role="img" aria-label={resource.type}>
                  {TYPE_ICONS[resource.type?.toLowerCase()] || '📦'}
                </span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-syne font-bold text-white mb-1">
                    {resource.title}
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
                    {resource.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-end">
              <StatusBadge status={resource.status} pulse={true} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-border">
          {/* Main Info */}
          <div className="col-span-2 p-8 space-y-8">
            <section>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin size={16} /> Location
              </h3>
              <p className="text-lg text-gray-200 bg-dark-base p-4 rounded-lg border border-dark-border">
                {resource.location}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlignLeft size={16} /> Description
              </h3>
              <div className="text-gray-300 bg-dark-base p-4 rounded-lg border border-dark-border min-h-[100px] whitespace-pre-wrap leading-relaxed">
                {resource.description || 'No additional description provided.'}
              </div>
            </section>
          </div>

          {/* Sidebar / Metadata */}
          <div className="p-8 bg-dark-base/50 space-y-8">
            <section>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={16} /> Quantity
              </h3>
              <p className="text-4xl font-syne font-bold text-white">{resource.quantity}</p>
            </section>

            <section>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar size={16} /> Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm text-gray-300">
                    {resource.createdAt ? format(new Date(resource.createdAt), 'PP p') : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-300">
                    {resource.updatedAt ? format(new Date(resource.updatedAt), 'PP p') : 'Unknown'}
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-6 border-t border-dark-border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle অ্যাক size={16} /> Update Status
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field capitalize"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusLoading || selectedStatus === resource.status}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statusLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
