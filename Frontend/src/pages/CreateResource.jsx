import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createResource } from '../services/resources';
import { validateResource } from '../utils/validators';
import { RESOURCE_TYPES } from '../utils/constants';
import { PlusCircle, AlertCircle } from 'lucide-react';

const CreateResource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'food',
    quantity: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateResource(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await createResource({
        ...formData,
        quantity: Number(formData.quantity)
      });
      toast.success('Resource registered successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-syne font-bold text-white tracking-wide">Register Resource</h1>
        <p className="text-gray-400 mt-1">Add new relief materials, personnel, or facilities to the network.</p>
      </div>

      <div className="glass-card p-6 md:p-8 border-t-4 border-t-accent-primary">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Resource Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., 500 Blankets for Shelter Alpha"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Resource Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field capitalize appearance-none"
              >
                {RESOURCE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Quantity / Count *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
                placeholder="e.g., 500"
              />
              {errors.quantity && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.quantity}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location Coordinates/Address *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`input-field ${errors.location ? 'border-red-500' : ''}`}
              placeholder="e.g., Sector 4, District HQ"
            />
            {errors.location && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Additional Details (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field resize-none"
              placeholder="Provide any additional context or requirements..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-dark-border">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg font-sans font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary min-w-[150px]"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle size={18} /> Register Resource
                </span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateResource;
