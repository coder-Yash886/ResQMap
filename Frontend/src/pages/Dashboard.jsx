import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ResourceBarChart from '../components/ResourceBarChart';
import RequestDonutChart from '../components/RequestDonutChart';
import RequestTrendChart from '../components/RequestTrendChart';
import ActiveRequestsTable from '../components/ActiveRequestsTable';
import LiveClock from '../components/LiveClock';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Operational Dashboard</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Real-time aid monitoring & resource sync</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LiveClock />
          <button 
            onClick={() => navigate('/raise-request')}
            className="btn-primary"
          >
            <Plus size={16} /> Raise Need
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Total Resources" value={24} color="blue" delta="+2 since morning" deltaUp={true} />
        <StatCard title="Pending Requests" value={9} color="amber" delta="+3 in last hour" deltaUp={false} />
        <StatCard title="In Progress" value={11} color="teal" delta="+5 assigned" deltaUp={true} />
        <StatCard title="Completed" value={4} color="green" delta="+1 just now" deltaUp={true} />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <ResourceBarChart />
        <RequestDonutChart />
      </div>

      {/* Bottom Row: Trend + Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <RequestTrendChart />
        <ActiveRequestsTable />
      </div>
    </div>
  );
};

export default Dashboard;
