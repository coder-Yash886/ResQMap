import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useSocketContext } from '../contexts/SocketContext';
import { getAllRequests, assignRequest, startDelivery, completeRequest } from '../services/requests';
import { Clock, CheckCircle2, User, MapPin, Zap, PlayCircle, Loader2, RefreshCw, Filter } from 'lucide-react';

const CAT_EMOJI = { food:'🍱', medicine:'💊', shelter:'🏠', clothes:'👕', volunteer:'🙋', funds:'💰', water:'💧', other:'📦' };
const URGENCY_COLOR = { low:'#6b7280', medium:'#3b82f6', high:'#f59e0b', critical:'#ef4444' };
const STATUS_ORDER = ['pending','matched','assigned','inProgress','completed'];
const STATUS_LABELS = { pending:'Pending', matched:'Matched', assigned:'Assigned', inProgress:'In Progress', completed:'Completed' };

const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

const StatusPipeline = ({ status }) => {
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
      {STATUS_ORDER.map((s, i) => {
        const done = i <= idx;
        const isLast = s === 'completed';
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', transition: 'all 0.3s',
                background: done ? (isLast ? '#22c55e' : '#E8650A') : 'rgba(255,255,255,0.1)',
                border: done ? `2px solid ${isLast ? '#22c55e' : '#E8650A'}` : '2px solid rgba(255,255,255,0.15)',
                boxShadow: done && i === idx ? `0 0 8px ${isLast ? '#22c55e' : '#E8650A'}` : 'none',
              }} />
              <span style={{ fontSize: '0.55rem', color: done ? '#94a3b8' : '#374151', whiteSpace: 'nowrap', fontWeight: done ? 600 : 400 }}>
                {s === 'inProgress' ? 'Progress' : STATUS_LABELS[s]}
              </span>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < idx ? '#E8650A' : 'rgba(255,255,255,0.08)', marginBottom: '14px', minWidth: '12px', transition: 'all 0.3s' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const NeedCard = ({ need, currentUser, onRefresh }) => {
  const [loading, setLoading] = useState('');
  const isMyNeed = need.requesterId === currentUser?.uid;

  const doAction = async (key, fn, msg) => {
    setLoading(key);
    try { await fn(); toast.success(msg); onRefresh(); }
    catch (e) { toast.error(e.response?.data?.message || 'Action failed'); }
    finally { setLoading(''); }
  };

  const urgColor = URGENCY_COLOR[need.urgency] || '#6b7280';
  const isCritical = need.urgency === 'critical';

  return (
    <div style={{
      background: '#0d1623', border: '1px solid #1e2d45', borderRadius: '14px',
      padding: '16px', marginBottom: '10px', position: 'relative', overflow: 'hidden',
      borderLeft: `3px solid ${urgColor}`,
      animation: isCritical ? 'cardPulse 2s ease-in-out infinite' : 'none',
    }}>
      {/* Urgency badge top-right */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '2px 8px', borderRadius: '20px', background: `${urgColor}20`, color: urgColor, fontSize: '0.68rem', fontWeight: 700, border: `1px solid ${urgColor}40` }}>
        {need.urgency?.toUpperCase()}
      </div>

      {/* Title + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', paddingRight: '70px' }}>
        <span style={{ fontSize: '1.4rem' }}>{CAT_EMOJI[need.category] || CAT_EMOJI.other}</span>
        <div>
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{need.title}</h4>
          <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'capitalize' }}>{need.category} · {need.quantity} {need.unit || 'units'}</span>
        </div>
      </div>

      {/* Location */}
      {need.location?.address && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4b5563', fontSize: '0.75rem', marginBottom: '4px' }}>
          <MapPin size={11} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{need.location.address}</span>
        </div>
      )}

      {/* Time + requester */}
      <div style={{ display: 'flex', gap: '12px', color: '#374151', fontSize: '0.72rem', marginBottom: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={10} />{timeAgo(need.createdAt)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><User size={10} />{need.requesterName || 'Anonymous'}</span>
      </div>

      {/* Status pipeline */}
      <StatusPipeline status={need.status} />

      {/* Contextual info */}
      {need.status === 'matched' && (
        <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(34,197,94,0.08)', borderRadius: '8px', color: '#22c55e', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={12} /> Resources found nearby
        </div>
      )}
      {need.assignedToName && (
        <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(168,85,247,0.08)', borderRadius: '8px', color: '#a855f7', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={12} /> Volunteer: <strong>{need.assignedToName}</strong>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: '10px' }}>
        {(need.status === 'pending' || need.status === 'matched') && !isMyNeed && (
          <button onClick={() => doAction('assign', () => assignRequest(need._id, currentUser?.uid || 'anon', currentUser?.displayName || currentUser?.email || 'Volunteer'), '✅ You accepted this need!')}
            disabled={loading === 'assign'}
            style={{ width: '100%', padding: '9px', borderRadius: '9px', background: 'linear-gradient(135deg,#E8650A,#c2440a)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
            {loading === 'assign' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={13} />}
            Accept & Assign
          </button>
        )}
        {need.status === 'assigned' && need.assignedTo === (currentUser?.uid || 'anon') && (
          <button onClick={() => doAction('start', () => startDelivery(need._id), '🚚 Delivery started!')}
            disabled={loading === 'start'}
            style={{ width: '100%', padding: '9px', borderRadius: '9px', background: 'rgba(59,130,246,0.15)', border: '1.5px solid rgba(59,130,246,0.4)', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {loading === 'start' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <PlayCircle size={13} />}
            Mark In Progress
          </button>
        )}
        {need.status === 'inProgress' && (isMyNeed || need.assignedTo === (currentUser?.uid || 'anon')) && (
          <button onClick={() => doAction('complete', () => completeRequest(need._id, { rating: 5 }), '🎉 Need fulfilled!')}
            disabled={loading === 'complete'}
            style={{ width: '100%', padding: '9px', borderRadius: '9px', background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.4)', color: '#4ade80', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {loading === 'complete' ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={13} />}
            Mark Complete
          </button>
        )}
        {need.status === 'completed' && (
          <div style={{ width: '100%', padding: '9px', borderRadius: '9px', background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontSize: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} /> Fulfilled ✓
          </div>
        )}
        {(need.status === 'pending' || need.status === 'matched') && isMyNeed && (
          <div style={{ width: '100%', padding: '9px', borderRadius: '9px', background: 'rgba(255,255,255,0.03)', color: '#4b5563', fontSize: '0.78rem', textAlign: 'center' }}>
            ⏳ Waiting for volunteer...
          </div>
        )}
      </div>
    </div>
  );
};

const TABS = ['all', 'pending', 'matched', 'assigned', 'inProgress', 'completed'];

const NeedsPanel = () => {
  const { currentUser } = useAuth();
  const { on, off } = useSocketContext();
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const filters = tab !== 'all' ? { status: tab } : {};
      const res = await getAllRequests(filters);
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const sorted = (res.data || []).sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9));
      setNeeds(sorted);
    } catch { toast.error('Failed to load needs'); }
    finally { setLoading(false); }
  }, [tab, refreshKey]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const refresh = () => setRefreshKey(k => k + 1);
    on('need:created', refresh); on('need:matched', refresh); on('need:assigned', refresh); on('need:updated', refresh);
    on('new_request', refresh); on('request_assigned', refresh); on('request_updated', refresh); on('request_completed', refresh);
    return () => {
      off('need:created', refresh); off('need:matched', refresh); off('need:assigned', refresh); off('need:updated', refresh);
      off('new_request', refresh); off('request_assigned', refresh); off('request_updated', refresh); off('request_completed', refresh);
    };
  }, [on, off]);

  return (
    <div style={{ background: '#0A0F1A', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem', margin: 0 }}>🆘 Active Needs</h3>
        <button onClick={() => setRefreshKey(k => k + 1)} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '10px 12px 0', flexShrink: 0, scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.15s',
              background: tab === t ? '#E8650A' : 'rgba(255,255,255,0.05)', color: tab === t ? '#fff' : '#6b7280' }}>
            {t === 'inProgress' ? 'In Progress' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Needs list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', color: '#374151' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#E8650A' }} />
          </div>
        ) : needs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#374151' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <p style={{ fontSize: '0.8rem' }}>No {tab !== 'all' ? tab : ''} needs found</p>
          </div>
        ) : (
          needs.map(n => <NeedCard key={n._id} need={n} currentUser={currentUser} onRefresh={fetch} />)
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardPulse { 0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.15); } 50% { box-shadow:0 0 12px 2px rgba(239,68,68,0.25); } }
      `}</style>
    </div>
  );
};

export default NeedsPanel;
