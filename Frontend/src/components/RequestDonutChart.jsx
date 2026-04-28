import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Medicine', value: 8,  color: '#f87171' },
  { name: 'Shelter',  value: 6,  color: '#60a5fa' },
  { name: 'Food',     value: 5,  color: '#fbbf24' },
  { name: 'Water',    value: 3,  color: '#34d399' },
  { name: 'Other',    value: 2,  color: '#a78bfa' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0b1120', border: '0.5px solid #141e2e',
        borderRadius: 8, padding: '8px 14px',
      }}>
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color, fontSize: 16, fontWeight: 700 }}>
          {payload[0].value} requests
        </p>
      </div>
    );
  }
  return null;
};

const RequestDonutChart = () => {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{
      background: '#0b1120', border: '0.5px solid #141e2e',
      borderRadius: 12, padding: '20px',
    }}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6080', marginBottom: 4 }}>
          Requests by category
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f1f5f9', margin: 0 }}>
          Category Split
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f1f5f9', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 9, color: '#4a6080', marginTop: 2 }}>TOTAL</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.map((entry) => (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: entry.color, flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontSize: 12, color: '#94a3b8' }}>{entry.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: entry.color }}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestDonutChart;
