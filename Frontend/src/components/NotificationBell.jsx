import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, MapPin, Zap, CheckCircle2, User, AlertTriangle } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';

const TYPE_CONFIG = {
  'need:created':   { icon: AlertTriangle, color: '#f97316', label: 'New Need' },
  'new_request':    { icon: AlertTriangle, color: '#f97316', label: 'New Need' },
  'need:matched':   { icon: Zap,           color: '#22c55e', label: 'Match Found' },
  'allocation_run': { icon: Zap,           color: '#22c55e', label: 'Auto-Matched' },
  'need:assigned':  { icon: User,          color: '#3b82f6', label: 'Volunteer Assigned' },
  'request_assigned':{ icon: User,         color: '#3b82f6', label: 'Volunteer Assigned' },
  'need:completed': { icon: CheckCircle2,  color: '#22c55e', label: 'Completed' },
  'request_completed':{ icon: CheckCircle2,color: '#22c55e', label: 'Completed' },
  critical:         { icon: AlertTriangle, color: '#ef4444', label: 'Critical Need' },
};

const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
};

const NotificationBell = () => {
  const { on, off } = useSocketContext();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef(null);

  const addNotif = (type) => (data) => {
    const notif = {
      id: Date.now() + Math.random(),
      type,
      data,
      time: new Date(),
      read: false,
      message: buildMessage(type, data),
    };
    setNotifications(prev => [notif, ...prev].slice(0, 30));
    setUnread(u => u + 1);
  };

  const buildMessage = (type, data) => {
    if (type === 'need:created' || type === 'new_request')
      return `New ${data?.category || 'need'} request: "${data?.title || 'Emergency need'}"`;
    if (type === 'need:matched' || type === 'allocation_run')
      return data?.matchCount ? `🤖 Auto-matched ${data.matchCount} request(s)!` : 'Match found for your need!';
    if (type === 'need:assigned' || type === 'request_assigned')
      return `Volunteer ${data?.assignedToName || 'assigned'} accepted a request`;
    if (type === 'need:completed' || type === 'request_completed')
      return `✅ "${data?.title || 'A need'}" has been fulfilled!`;
    return 'System update';
  };

  useEffect(() => {
    const events = ['need:created', 'new_request', 'need:matched', 'allocation_run', 'need:assigned', 'request_assigned', 'need:completed', 'request_completed'];
    const handlers = {};
    events.forEach(ev => {
      handlers[ev] = addNotif(ev);
      on(ev, handlers[ev]);
    });
    return () => events.forEach(ev => off(ev, handlers[ev]));
  }, [on, off]);

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <div ref={panelRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) { setUnread(0); setNotifications(p => p.map(n => ({ ...n, read: true }))); } }}
        style={{
          position: 'relative', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#9ca3af'; }}
      >
        <Bell size={18} style={{ animation: unread > 0 ? 'bellShake 0.5s ease-in-out' : 'none' }} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0A0F1A', animation: 'ping 1s ease-in-out infinite',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: '320px', background: '#111827', border: '1.5px solid #1e2d45',
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          zIndex: 9999, animation: 'slideDown 0.2s ease', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e2d45', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>🔔 Notifications</h4>
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#E8650A', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Mark all read
            </button>
          </div>

          {/* List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                <p style={{ color: '#4b5563', fontSize: '0.82rem', margin: 0 }}>All clear! No new alerts</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.critical;
                const Icon = cfg.icon;
                return (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid rgba(30,45,69,0.6)',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    background: n.read ? 'transparent' : 'rgba(232,101,10,0.04)',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#4b5563', fontSize: '0.68rem', fontWeight: 700, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</p>
                      <p style={{ color: n.read ? '#6b7280' : '#d1d5db', fontSize: '0.8rem', margin: 0, lineHeight: '1.4' }}>{n.message}</p>
                      <p style={{ color: '#374151', fontSize: '0.68rem', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {timeAgo(n.time)}
                        {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8650A', display: 'inline-block' }} />}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bellShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
};

export default NotificationBell;
