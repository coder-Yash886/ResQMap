import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TYPE_COLORS } from '../utils/constants';

const ResourceChart = ({ resources }) => {
  const data = useMemo(() => {
    const counts = resources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: counts[key],
      color: TYPE_COLORS[key]
    }));
  }, [resources]);

  const COLORS = {
    green: '#22C55E',
    blue: '#3B82F6',
    amber: '#F59E0B',
    purple: '#A855F7',
    orange: '#E8650A'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-dark-border bg-dark-base/90">
          <p className="font-syne font-bold text-white">{payload[0].name}</p>
          <p className="text-accent-primary">{`${payload[0].value} Resources`}</p>
        </div>
      );
    }
    return null;
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="glass-card h-64 flex items-center justify-center">
        <p className="text-gray-500 font-syne">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 h-80 flex flex-col">
      <h3 className="text-lg font-syne font-bold text-white mb-2 ml-2">Resource Distribution</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.color] || '#6B7280'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontFamily: 'DM Sans', color: '#9CA3AF' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceChart;
