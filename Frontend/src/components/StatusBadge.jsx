import React from 'react';

const StatusBadge = ({ status, pulse = false }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-status-available/10 text-status-available border-status-available/20';
      case 'allocated':
        return 'bg-status-allocated/10 text-status-allocated border-status-allocated/20';
      case 'completed':
        return 'bg-status-completed/10 text-gray-400 border-status-completed/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getLabel = () => {
    switch (status?.toLowerCase()) {
      case 'available': return '● Available';
      case 'allocated': return '● Allocated';
      case 'completed': return '✓ Completed';
      default: return status || 'Unknown';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${getStyles()} ${pulse && status === 'available' ? 'animate-pulse-urgent' : ''}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
