import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { createNeedRequest } from '../services/requests';
import {
  Utensils, Pill, Home, Shirt, Users, DollarSign,
  Droplets, Package, MapPin, Loader2, X, Send, Navigation
} from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'food',      label: 'Food',      icon: Utensils,    emoji: '🍱', color: '#22c55e' },
  { id: 'medicine',  label: 'Medicine',  icon: Pill,        emoji: '💊', color: '#3b82f6' },
  { id: 'shelter',   label: 'Shelter',   icon: Home,        emoji: '🏠', color: '#f59e0b' },
  { id: 'clothes',   label: 'Clothes',   icon: Shirt,       emoji: '👕', color: '#a855f7' },
  { id: 'volunteer', label: 'Volunteer', icon: Users,       emoji: '🙋', color: '#ec4899' },
  { id: 'funds',     label: 'Funds',     icon: DollarSign,  emoji: '💰', color: '#14b8a6' },
];

const URGENCY = [
  { id: 'low',      label: 'Low',      color: '#6b7280', pulse: false },
  { id: 'medium',   label: 'Medium',   color: '#3b82f6', pulse: false },
  { id: 'high',     label: 'High',     color: '#f59e0b', pulse: false },
  { id: 'critical', label: 'Critical', color: '#ef4444', pulse: true  },
];

// ─── Floating Raise-Need Button + Modal ──────────────────────────────────────
const NeedRaiseModal = ({ onNeedCreated }) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [form, setForm] = useState({
    category: '', quantity: '', urgency: '',
    location: { address: '', lat: null, lng: null },
  });
  const [errors, setErrors] = useState({});

  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const d = await r.json();
        if (d?.display_name) address = d.display_name.split(',').slice(0, 3).join(', ');
      } catch (_) {}
      setForm(f => ({ ...f, location: { address, lat, lng } }));
      toast.success('📍 Location detected!');
      setGpsLoading(false);
    }, () => {
      toast.error('Could not detect location');
      setGpsLoading(false);
    }, { timeout: 10000 });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.category) e.category = 'Select a category';
    if (!form.quantity || Number(form.quantity) < 1) e.quantity = 'Enter quantity';
    if (!form.urgency) e.urgency = 'Select urgency';
    if (!form.location.address.trim()) e.location = 'Enter location';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await createNeedRequest({
        title: `${CATEGORIES.find(c => c.id === form.category)?.label || form.category} needed`,
        category: form.category,
        quantity: Number(form.quantity),
        urgency: form.urgency,
        location: form.location,
        requesterId: currentUser?.uid || 'anonymous',
        requesterName: currentUser?.displayName || currentUser?.email || 'Anonymous',
        requesterEmail: currentUser?.email || '',
      });
      toast.success('🚨 Need raised! Matching resources...');
      setOpen(false);
      setForm({ category: '', quantity: '', urgency: '', location: { address: '', lat: null, lng: null } });
      setErrors({});
      onNeedCreated?.(result?.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to raise need');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '28px', left: '280px', zIndex: 9000,
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '14px 20px', borderRadius: '50px',
          background: 'linear-gradient(135deg, #E8650A, #c2440a)',
          border: 'none', color: '#fff', fontWeight: 800, fontSize: '0.9rem',
          cursor: 'pointer', boxShadow: '0 6px 30px rgba(232,101,10,0.5)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🆘</span>
        Raise Need
      </button>

      {/* ── Modal Backdrop ── */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div style={{
            background: '#111827', border: '1px solid #1e2d45',
            borderRadius: '20px', width: '100%', maxWidth: '520px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>🚨 Raise Emergency Need</h2>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '4px 0 0' }}>Request will be matched with nearby resources</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px 24px' }}>
              {/* Category Grid */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Category {errors.category && <span style={{ color: '#ef4444', marginLeft: '8px' }}>← {errors.category}</span>}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {CATEGORIES.map(cat => {
                    const sel = form.category === cat.id;
                    return (
                      <button key={cat.id} type="button"
                        onClick={() => { setForm(f => ({ ...f, category: cat.id })); setErrors(e => ({ ...e, category: undefined })); }}
                        style={{
                          padding: '12px 8px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s',
                          background: sel ? `${cat.color}18` : 'rgba(255,255,255,0.04)',
                          border: sel ? `2px solid ${cat.color}` : '1.5px solid rgba(255,255,255,0.08)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                          transform: sel ? 'scale(1.04)' : 'scale(1)',
                          boxShadow: sel ? `0 0 14px ${cat.color}40` : 'none',
                        }}>
                        <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: sel ? cat.color : '#6b7280' }}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quantity {errors.quantity && <span style={{ color: '#ef4444', marginLeft: '8px' }}>← {errors.quantity}</span>}
                </label>
                <input type="number" min="1" value={form.quantity}
                  onChange={e => { setForm(f => ({ ...f, quantity: e.target.value })); setErrors(e2 => ({ ...e2, quantity: undefined })); }}
                  placeholder="e.g. 50"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: errors.quantity ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Urgency */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Urgency {errors.urgency && <span style={{ color: '#ef4444', marginLeft: '8px' }}>← {errors.urgency}</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {URGENCY.map(u => {
                    const sel = form.urgency === u.id;
                    return (
                      <button key={u.id} type="button"
                        onClick={() => { setForm(f => ({ ...f, urgency: u.id })); setErrors(e => ({ ...e, urgency: undefined })); }}
                        style={{
                          flex: 1, padding: '10px 6px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s',
                          background: sel ? `${u.color}20` : 'rgba(255,255,255,0.04)',
                          border: sel ? `2px solid ${u.color}` : '1.5px solid rgba(255,255,255,0.08)',
                          color: sel ? u.color : '#6b7280', fontWeight: 700, fontSize: '0.78rem',
                          animation: sel && u.pulse ? 'criticalPulse 1.5s ease-in-out infinite' : 'none',
                        }}>
                        {u.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Location {errors.location && <span style={{ color: '#ef4444', marginLeft: '8px' }}>← {errors.location}</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={form.location.address}
                    onChange={e => { setForm(f => ({ ...f, location: { ...f.location, address: e.target.value } })); setErrors(e2 => ({ ...e2, location: undefined })); }}
                    placeholder="Type address or use GPS →"
                    style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', border: errors.location ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={detectGPS} disabled={gpsLoading}
                    style={{ padding: '11px 14px', borderRadius: '10px', cursor: 'pointer', background: form.location.lat ? 'rgba(34,197,94,0.15)' : 'rgba(232,101,10,0.15)', border: form.location.lat ? '1.5px solid rgba(34,197,94,0.5)' : '1.5px solid rgba(232,101,10,0.5)', color: form.location.lat ? '#22c55e' : '#E8650A', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {gpsLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={15} />}
                    {form.location.lat ? 'GPS ✓' : 'GPS'}
                  </button>
                </div>
                {form.location.lat && (
                  <p style={{ color: '#475569', fontSize: '0.72rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={10} /> 📍 Using your location · {form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="button" onClick={handleSubmit} disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #E8650A, #c2440a)',
                  border: 'none', color: '#fff', fontWeight: 800, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 20px rgba(232,101,10,0.4)', opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}>
                {loading
                  ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                  : <><Send size={18} /> Send Request</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes criticalPulse { 0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow:0 0 0 8px rgba(239,68,68,0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default NeedRaiseModal;
