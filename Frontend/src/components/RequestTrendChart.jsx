import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', Total: 8,  Critical: 2, Completed: 3 },
  { day: 'Tue', Total: 11, Critical: 3, Completed: 5 },
  { day: 'Wed', Total: 14, Critical: 4, Completed: 7 },
  { day: 'Thu', Total: 13, Critical: 5, Completed: 8 },
  { day: 'Fri', Total: 18, Critical: 6, Completed: 10 },
  { day: 'Sat', Total: 21, Critical: 7, Completed: 13 },
  { day: 'Sun', Total: 24, Critical: 9, Completed: 15 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0b1120', border: '0.5px solid #141e2e',
        borderRadius: 8, padding: '10px 16px',
      }}>
        <p style={{ color: '#4a6080', fontSize: 11, marginBottom: 6, fontWeight: 700 }}>{label}</p>
        {payload.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>{p.name}</span>
            <span style={{ color: p.color, fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegend = ({ payload }) => (
  <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', paddingRight: 8, marginBottom: 4 }}>
    {payload.map(entry => (
      <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

const RequestTrendChart = () => (
  <div style={{
    background: '#0b1120', border: '0.5px solid #141e2e',
    borderRadius: 12, padding: '20px 20px 12px',
  }}>
    <div style={{ marginBottom: 4 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6080', marginBottom: 4 }}>
        Request trend — last 7 days
      </p>
      <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f1f5f9', margin: 0 }}>
        Weekly Trend
      </h3>
    </div>

    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#f87171" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#10192a" strokeWidth={0.8} />
        <XAxis dataKey="day" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4a6080', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
        <Area
          type="monotone" dataKey="Total" stroke="#60a5fa" strokeWidth={2}
          fill="url(#gradTotal)" dot={{ r: 3, fill: '#60a5fa', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone" dataKey="Critical" stroke="#f87171" strokeWidth={2}
          fill="url(#gradCritical)" dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone" dataKey="Completed" stroke="#4ade80" strokeWidth={2}
          fill="none" dot={{ r: 3, fill: '#4ade80', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RequestTrendChart;
