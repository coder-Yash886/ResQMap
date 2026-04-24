import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`animate-spin rounded-full border-t-accent-primary border-dark-border ${sizeClasses[size]}`}></div>
  );
};

export default LoadingSpinner;
