import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="glass-card p-6 animate-fade-in flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-dark-base rounded-lg border border-dark-border">
          <Icon className="text-accent-primary" size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-status-available' : 'text-gray-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 font-sans text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-syne font-bold text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
