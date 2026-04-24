import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { TYPE_ICONS, TYPE_COLORS } from '../utils/constants';
import StatusBadge from './StatusBadge';

const ResourceCard = ({ resource }) => {
  const { _id, id, title, type, quantity, location, status } = resource;
  const resourceId = _id || id;
  const color = TYPE_COLORS[type?.toLowerCase()] || 'gray';
  
  // Tailwind dynamic border classes (need full class names for purge/JIT)
  const borderColors = {
    green: 'border-l-status-available',
    blue: 'border-l-[#3B82F6]',
    amber: 'border-l-status-allocated',
    purple: 'border-l-[#A855F7]',
    orange: 'border-l-accent-primary',
    gray: 'border-l-gray-500'
  };

  return (
    <div className={`glass-card p-5 animate-fade-in flex flex-col h-full border-l-4 ${borderColors[color]} group`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={type}>
            {TYPE_ICONS[type?.toLowerCase()] || '📦'}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {type}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <h3 className="text-xl font-syne font-bold text-gray-100 mb-2 line-clamp-1 group-hover:text-accent-primary transition-colors">
        {title}
      </h3>
      
      <div className="flex items-center gap-1.5 text-gray-400 mb-4 text-sm">
        <MapPin size={16} className="text-accent-primary" />
        <span className="truncate">{location}</span>
      </div>
      
      <div className="mt-auto pt-4 border-t border-dark-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Quantity</span>
          <span className="text-lg font-bold font-syne text-gray-200">{quantity}</span>
        </div>
        
        <Link 
          to={`/resources/${resourceId}`}
          className="text-sm font-medium text-accent-primary hover:text-white transition-colors bg-accent-primary/10 hover:bg-accent-primary px-3 py-1.5 rounded-lg border border-accent-primary/20"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
