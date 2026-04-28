import React from 'react';

const ACCENTS = {
  blue:  { bar: 'stat-accent-blue',  val: '#60a5fa', icon: '↑' },
  amber: { bar: 'stat-accent-amber', val: '#fbbf24', icon: '↓' },
  teal:  { bar: 'stat-accent-teal',  val: '#2dd4bf', icon: '↑' },
  green: { bar: 'stat-accent-green', val: '#4ade80', icon: '↑' },
};

/**
 * @param {string} title
 * @param {number} value
 * @param {string} color – 'blue' | 'amber' | 'teal' | 'green'
 * @param {string} delta – e.g. "+3 today"
 * @param {boolean} deltaUp
 */
const StatCard = ({ title, value, color = 'blue', delta, deltaUp = true, icon: Icon }) => {
  const accent = ACCENTS[color] || ACCENTS.blue;

  return (
    <div
      className="animate-fade-in"
      style={{
        background: '#0b1120',
        border: '0.5px solid #141e2e',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Accent top line */}
      <div className={accent.bar} style={{ height: 2, width: '100%' }} />

      <div style={{ padding: '18px 20px 16px' }}>
        {/* Label */}
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#4a6080',
          marginBottom: 10,
        }}>{title}</div>

        {/* Value */}
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'Syne, sans-serif',
          color: '#f1f5f9',
          lineHeight: 1,
          marginBottom: 10,
        }}>{value}</div>

        {/* Delta */}
        {delta && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: deltaUp ? accent.val : '#f87171',
            fontWeight: 600,
          }}>
            <span style={{ fontSize: 13 }}>{deltaUp ? '▲' : '▼'}</span>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
