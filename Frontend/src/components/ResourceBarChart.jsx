import React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Medicine', value: 18, color: '#ef4444' },
  { name: 'Shelter',  value: 24, color: '#f87171' },
  { name: 'Water',    value: 47, color: '#fbbf24' },
  { name: 'Food',     value: 62, color: '#4ade80' },
  { name: 'Clothes',  value: 80, color: '#60a5fa' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0b1120', border: '0.5px solid #141e2e',
        borderRadius: 8, padding: '8px 14px',
      }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: payload[0].fill, fontSize: 16, fontWeight: 700 }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ResourceBarChart = () => (
  <div style={{
    background: '#0b1120', border: '0.5px solid #141e2e',
    borderRadius: 12, padding: '20px 20px 12px',
  }}>
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6080', marginBottom: 4 }}>
        Resource stock levels
      </p>
      <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f1f5f9', margin: 0 }}>
        Stock Overview
      </h3>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid vertical={false} stroke="#10192a" strokeWidth={0.8} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#4a6080', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#4a6080', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ResourceBarChart;
