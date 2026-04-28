import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSocketContext } from '../contexts/SocketContext';
import { getAllRequests, assignRequest, startDelivery, completeRequest } from '../services/requests';
import {
  Utensils, Pill, Home, Shirt, Droplets, Package,
  MapPin, Clock, User, CheckCircle2, RefreshCw,
  Zap, AlertTriangle, PlayCircle, Star, Filter,
  ClipboardList, Loader2
} from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────
const CAT_MAP = {
  food:     { icon: Utensils,  color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  medicine: { icon: Pill,      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  shelter:  { icon: Home,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  clothes:  { icon: Shirt,     color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  water:    { icon: Droplets,  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  other:    { icon: Package,   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
};

const URGENCY_MAP = {
  low:      { color: '#22c55e', label: 'Low' },
  medium:   { color: '#f59e0b', label: 'Medium' },
  high:     { color: '#f97316', label: 'High' },
  critical: { color: '#ef4444', label: 'Critical' },
};

const STATUS_TABS = [
  { id: 'all',        label: 'All',        icon: ClipboardList },
  { id: 'pending',    label: 'Pending',    icon: Clock },
  { id: 'assigned',   label: 'Assigned',   icon: User },
  { id: 'inProgress', label: 'In Progress',icon: PlayCircle },
  { id: 'completed',  label: 'Completed',  icon: CheckCircle2 },
];

// ─── Time helper ──────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

// ─── Request Card ─────────────────────────────────────────────────────────────
const RequestCard = ({ req, currentUser, onAction }) => {
  const [actionLoading, setActionLoading] = useState('');
  const cat  = CAT_MAP[req.category] || CAT_MAP.other;
  const urg  = URGENCY_MAP[req.urgency] || URGENCY_MAP.low;
  const Icon = cat.icon;
  const isMyRequest = req.requesterId === currentUser?.uid;

  const doAction = async (action, fn, successMsg) => {
    setActionLoading(action);
    try {
      await fn();
      toast.success(successMsg);
      onAction();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div style={{
      background:'rgba(15,23,42,0.85)', border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:'16px', padding:'20px', transition:'all 0.2s',
      borderLeft: `3px solid ${urg.color}`,
      backdropFilter:'blur(8px)',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={22} color={cat.color} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#f1f5f9', marginBottom:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.title}</h3>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {/* Category badge */}
            <span style={{ background:cat.bg, color:cat.color, padding:'2px 8px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:600, textTransform:'capitalize' }}>{req.category}</span>
            {/* Urgency badge */}
            <span style={{ background:`${urg.color}22`, color:urg.color, padding:'2px 8px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700 }}>{urg.label}</span>
            {/* Status badge */}
            <span style={{
              padding:'2px 8px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:600,
              background: req.status === 'completed' ? 'rgba(34,197,94,0.12)' : req.status === 'pending' ? 'rgba(148,163,184,0.12)' : req.status === 'inProgress' ? 'rgba(59,130,246,0.12)' : 'rgba(168,85,247,0.12)',
              color:       req.status === 'completed' ? '#22c55e'             : req.status === 'pending' ? '#94a3b8'               : req.status === 'inProgress' ? '#3b82f6'               : '#a855f7',
            }}>
              {req.status === 'inProgress' ? 'In Progress' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </div>
        </div>
        {/* Time */}
        <span style={{ color:'#475569', fontSize:'0.72rem', whiteSpace:'nowrap', flexShrink:0 }}>
          {timeAgo(req.createdAt)}
        </span>
      </div>

      {/* Details */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'10px' }}>
          <p style={{ color:'#475569', fontSize:'0.68rem', marginBottom:'2px' }}>QUANTITY</p>
          <p style={{ color:'#e2e8f0', fontWeight:700 }}>{req.quantity} <span style={{ color:'#64748b', fontWeight:400, fontSize:'0.8rem' }}>{req.unit || 'units'}</span></p>
        </div>
        <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'8px', padding:'10px' }}>
          <p style={{ color:'#475569', fontSize:'0.68rem', marginBottom:'2px' }}>RAISED BY</p>
          <p style={{ color:'#e2e8f0', fontWeight:600, fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.requesterName || 'Anonymous'}</p>
        </div>
      </div>

      {/* Location */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'6px', marginBottom:'14px', color:'#64748b', fontSize:'0.8rem' }}>
        <MapPin size={13} style={{ flexShrink:0, marginTop:'2px', color:'#475569' }} />
        <span style={{ overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
          {req.location?.address || 'Location not specified'}
        </span>
      </div>

      {/* Volunteer info (if assigned) */}
      {req.assignedToName && (
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px', color:'#a855f7', fontSize:'0.8rem', background:'rgba(168,85,247,0.08)', padding:'8px 12px', borderRadius:'8px' }}>
          <User size={13} />
          <span>Volunteer: <strong>{req.assignedToName}</strong></span>
        </div>
      )}

      {/* Completion feedback */}
      {req.status === 'completed' && req.feedback?.rating && (
        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'14px', color:'#f59e0b', fontSize:'0.8rem' }}>
          {Array.from({ length: req.feedback.rating }).map((_, i) => <Star key={i} size={13} fill="#f59e0b" />)}
          <span style={{ color:'#64748b', marginLeft:'4px' }}>{req.feedback.comment}</span>
        </div>
      )}

      {/* ── Action Buttons ── */}
      {req.status === 'pending' && !isMyRequest && (
        <button
          onClick={() => doAction('assign', () => assignRequest(req._id, currentUser?.uid || 'anon', currentUser?.displayName || currentUser?.email || 'Volunteer'), 'You accepted this request!')}
          disabled={actionLoading === 'assign'}
          style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: actionLoading ? 0.7 : 1, transition:'all 0.2s' }}>
          {actionLoading === 'assign' ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          Accept & Volunteer
        </button>
      )}

      {req.status === 'assigned' && req.assignedTo === (currentUser?.uid || 'anon') && (
        <button
          onClick={() => doAction('start', () => startDelivery(req._id), 'Delivery started!')}
          disabled={actionLoading === 'start'}
          style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(59,130,246,0.2)', border:'1.5px solid rgba(59,130,246,0.4)', color:'#60a5fa', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: actionLoading ? 0.7 : 1 }}>
          {actionLoading === 'start' ? <Loader2 size={15} className="animate-spin" /> : <PlayCircle size={15} />}
          Start Delivery
        </button>
      )}

      {req.status === 'inProgress' && (isMyRequest || req.assignedTo === (currentUser?.uid || 'anon')) && (
        <button
          onClick={() => doAction('complete', () => completeRequest(req._id, { rating: 5, comment: 'Delivered successfully' }), '🎉 Request completed!')}
          disabled={actionLoading === 'complete'}
          style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(34,197,94,0.15)', border:'1.5px solid rgba(34,197,94,0.4)', color:'#4ade80', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: actionLoading ? 0.7 : 1 }}>
          {actionLoading === 'complete' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
          Mark as Delivered
        </button>
      )}

      {req.status === 'pending' && isMyRequest && (
        <div style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(255,255,255,0.07)', color:'#475569', fontSize:'0.82rem', textAlign:'center' }}>
          ⏳ Waiting for a volunteer to accept...
        </div>
      )}

      {req.status === 'completed' && (
        <div style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(34,197,94,0.08)', border:'1.5px solid rgba(34,197,94,0.2)', color:'#22c55e', fontSize:'0.82rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
          <CheckCircle2 size={14} /> Delivered ✓
        </div>
      )}
    </div>
  );
};

// ─── Main Board ───────────────────────────────────────────────────────────────
const RequestsBoard = () => {
  const { currentUser } = useAuth();
  const { on, off } = useSocketContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeTab !== 'all') filters.status = activeTab;
      if (categoryFilter) filters.category = categoryFilter;
      const data = await getAllRequests(filters);
      setRequests(data.data || []);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, refreshKey]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // ── Real-time socket updates ───────────────────────────────────────────────
  useEffect(() => {
    const refresh = () => setRefreshKey(k => k + 1);
    on('new_request', refresh); on('request_assigned', refresh);
    on('request_updated', refresh); on('request_completed', refresh);
    on('need:created', refresh); on('need:assigned', refresh);
    return () => {
      off('new_request', refresh); off('request_assigned', refresh);
      off('request_updated', refresh); off('request_completed', refresh);
      off('need:created', refresh); off('need:assigned', refresh);
    };
  }, [on, off]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'inProgress').length,
    completed:  requests.filter(r => r.status === 'completed').length,
  };

  // ── Urgency sort: critical first ───────────────────────────────────────────
  const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...requests].sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9));

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', animation:'fadeIn 0.4s ease' }}>
      {/* ── Header ── */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:'16px', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#f1f5f9', lineHeight:1.2 }}>Requests Board</h1>
          <p style={{ color:'#64748b', marginTop:'4px', fontSize:'0.875rem' }}>Live feed of all active need requests</p>
        </div>
        <button onClick={() => setRefreshKey(k => k + 1)} disabled={loading}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 18px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontWeight:600, cursor:'pointer', fontSize:'0.85rem' }}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'Total',       value: stats.total,      color:'#6366f1' },
          { label:'Pending',     value: stats.pending,    color:'#f59e0b' },
          { label:'In Progress', value: stats.inProgress, color:'#3b82f6' },
          { label:'Completed',   value: stats.completed,  color:'#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ background:'rgba(15,23,42,0.8)', border:`1.5px solid ${s.color}22`, borderRadius:'12px', padding:'16px', textAlign:'center' }}>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:s.color }}>{s.value}</p>
            <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center', marginBottom:'20px' }}>
        {/* Status tabs */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'4px', gap:'2px', overflowX:'auto' }}>
          {STATUS_TABS.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding:'7px 14px', borderRadius:'7px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'6px', transition:'all 0.2s', border:'none',
                  background: activeTab === tab.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#a5b4fc' : '#475569',
                }}>
                <TabIcon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <Filter size={13} color="#475569" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding:'7px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontSize:'0.8rem', outline:'none', cursor:'pointer' }}>
            <option value="">All Categories</option>
            {Object.keys(CAT_MAP).map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'300px', gap:'12px', color:'#475569' }}>
          <Loader2 size={28} style={{ animation:'spin 1s linear infinite', color:'#6366f1' }} />
          <span>Loading requests...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px', color:'#475569' }}>
          <ClipboardList size={48} style={{ margin:'0 auto 16px', opacity:0.3 }} />
          <h3 style={{ color:'#64748b', fontWeight:700, marginBottom:'8px' }}>No requests found</h3>
          <p style={{ fontSize:'0.875rem' }}>
            {activeTab !== 'all' ? `No ${activeTab} requests.` : 'No requests yet.'}{' '}
            <a href="/raise-request" style={{ color:'#818cf8', textDecoration:'none' }}>Raise one now →</a>
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>
          {sorted.map(req => (
            <RequestCard key={req._id} req={req} currentUser={currentUser} onAction={fetchRequests} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default RequestsBoard;
