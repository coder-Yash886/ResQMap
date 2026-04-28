import React from 'react';
import { Pill, Home, Utensils, Droplet, Plus } from 'lucide-react';

const requests = [
  {
    id: 1,
    type: 'medicine',
    title: 'Urgent Insulin Supply',
    sector: 'Sector 4',
    time: '2 mins ago',
    urgency: 'critical',
    icon: Plus,
    color: '#f87171'
  },
  {
    id: 2,
    type: 'shelter',
    title: 'Temporary Tent Setup',
    sector: 'Sector 2',
    time: '12 mins ago',
    urgency: 'high',
    icon: Home,
    color: '#fb923c'
  },
  {
    id: 3,
    type: 'food',
    title: 'Bulk Dry Rations',
    sector: 'Sector 4',
    time: '45 mins ago',
    urgency: 'medium',
    icon: Utensils,
    color: '#60a5fa'
  },
  {
    id: 4,
    type: 'water',
    title: 'Potable Water Tanker',
    sector: 'Sector 1',
    time: '1 hr ago',
    urgency: 'high',
    icon: Droplet,
    color: '#fb923c'
  }
];

const getUrgencyClass = (urgency) => {
  if (urgency === 'critical') return 'pill-critical';
  if (urgency === 'high') return 'pill-high';
  return 'pill-medium';
};

const ActiveRequestsTable = () => {
  return (
    <div style={{ background: '#0b1120', border: '0.5px solid #141e2e', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '0.5px solid #141e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Active Requests</h3>
        <button style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View All</button>
      </div>
      <div style={{ padding: '8px 0' }}>
        {requests.map((req) => (
          <div key={req.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '0.5px solid rgba(20, 30, 46, 0.5)', transition: 'background 0.2s' }} className="hover:bg-white/[0.02]">
            {/* Category Icon */}
            <div style={{ width: 32, height: 32, borderRadius: 6, background: `${req.color}15`, border: `0.5px solid ${req.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14, flexShrink: 0 }}>
              <req.icon size={16} style={{ color: req.color }} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.title}</div>
              <div style={{ fontSize: 11, color: '#4a6080', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{req.sector}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#141e2e' }} />
                <span>{req.time}</span>
              </div>
            </div>

            {/* Urgency Pill */}
            <div className={getUrgencyClass(req.urgency)}>
              {req.urgency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveRequestsTable;
