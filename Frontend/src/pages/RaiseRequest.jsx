import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { createNeedRequest } from '../services/requests';
import {
  Utensils, Pill, Home, Shirt, Droplets, Package,
  MapPin, Loader2, AlertTriangle, CheckCircle2, Send,
  Navigation, ChevronRight
} from 'lucide-react';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'food',      label: 'Food',      icon: Utensils,  color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  unit: 'packets' },
  { id: 'medicine',  label: 'Medicine',  icon: Pill,      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', unit: 'kits'    },
  { id: 'shelter',   label: 'Shelter',   icon: Home,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', unit: 'people'  },
  { id: 'clothes',   label: 'Clothes',   icon: Shirt,     color: '#a855f7', bg: 'rgba(168,85,247,0.12)', unit: 'bundles' },
  { id: 'water',     label: 'Water',     icon: Droplets,  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  unit: 'litres'  },
  { id: 'other',     label: 'Other',     icon: Package,   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)',unit: 'units'   },
];

// ─── Urgency config ───────────────────────────────────────────────────────────
const URGENCY_LEVELS = [
  { id: 'low',      label: 'Low',      desc: 'Can wait a few days',    color: '#22c55e', border: 'rgba(34,197,94,0.4)'   },
  { id: 'medium',   label: 'Medium',   desc: 'Needed within 24 hrs',   color: '#f59e0b', border: 'rgba(245,158,11,0.4)'  },
  { id: 'high',     label: 'High',     desc: 'Needed urgently today',  color: '#f97316', border: 'rgba(249,115,22,0.4)'  },
  { id: 'critical', label: 'Critical', desc: 'Life-threatening!',      color: '#ef4444', border: 'rgba(239,68,68,0.4)'   },
];

// ─── Component ────────────────────────────────────────────────────────────────
const RaiseRequest = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1); // 1 = form, 2 = preview, 3 = success
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    urgency: '',
    location: { address: '', lat: null, lng: null },
    description: '',
  });
  const [errors, setErrors] = useState({});

  // ── GPS auto-detect ─────────────────────────────────────────────────────────
  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Try reverse geocode via free Nominatim API
        let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data?.display_name) address = data.display_name;
        } catch (_) { /* use coords as fallback */ }

        setFormData(prev => ({
          ...prev,
          location: { address, lat, lng },
        }));
        toast.success('Location detected!');
        setGpsLoading(false);
      },
      () => {
        toast.error('Could not get location. Please type it manually.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.category) e.category = 'Please select a category';
    if (!formData.quantity || Number(formData.quantity) < 1) e.quantity = 'Enter a valid quantity';
    if (!formData.urgency) e.urgency = 'Please select urgency level';
    if (!formData.location.address.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    const selectedCat = CATEGORIES.find(c => c.id === formData.category);

    setSubmitting(true);
    try {
      await createNeedRequest({
        title: formData.title.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: selectedCat?.unit || 'units',
        urgency: formData.urgency,
        location: formData.location,
        description: formData.description.trim(),
        requesterId: currentUser?.uid || 'anonymous',
        requesterName: currentUser?.displayName || currentUser?.email || 'Anonymous',
        requesterEmail: currentUser?.email || '',
      });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to raise request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCat = CATEGORIES.find(c => c.id === formData.category);
  const selectedUrgency = URGENCY_LEVELS.find(u => u.id === formData.urgency);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const Field = ({ label, error, children }) => (
    <div>
      <label style={{ display:'block', fontSize:'0.8rem', fontWeight:600, color:'#94a3b8', marginBottom:'6px', letterSpacing:'0.05em', textTransform:'uppercase' }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color:'#f87171', fontSize:'0.75rem', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
          <AlertTriangle size={11} /> {error}
        </p>
      )}
    </div>
  );

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ maxWidth:'500px', margin:'0 auto', textAlign:'center', padding:'60px 20px', animation:'fadeIn 0.5s ease' }}>
        <div style={{
          width:'80px', height:'80px', borderRadius:'50%',
          background:'rgba(34,197,94,0.15)', border:'2px solid rgba(34,197,94,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 24px', animation:'pulse 2s infinite'
        }}>
          <CheckCircle2 size={40} color="#22c55e" />
        </div>
        <h2 style={{ fontSize:'1.8rem', fontWeight:800, color:'#f1f5f9', marginBottom:'8px' }}>Request Raised!</h2>
        <p style={{ color:'#94a3b8', marginBottom:'8px' }}>
          Your <strong style={{ color: selectedCat?.color || '#fff' }}>{selectedCat?.label || formData.category}</strong> request has been submitted.
        </p>
        <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:'32px' }}>
          Our smart matching engine will find the nearest available volunteer or resource automatically.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <button
            onClick={() => navigate('/requests')}
            style={{ padding:'10px 24px', borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.9rem' }}
          >
            View All Requests
          </button>
          <button
            onClick={() => { setStep(1); setFormData({ title:'', category:'', quantity:'', urgency:'', location:{address:'',lat:null,lng:null}, description:'' }); setErrors({}); }}
            style={{ padding:'10px 24px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#cbd5e1', fontWeight:600, cursor:'pointer', fontSize:'0.9rem' }}
          >
            Raise Another
          </button>
        </div>
      </div>
    );
  }

  // ── Preview Screen ──────────────────────────────────────────────────────────
  if (step === 2) {
    const CatIcon = selectedCat?.icon || Package;
    return (
      <div style={{ maxWidth:'580px', margin:'0 auto', animation:'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom:'28px' }}>
          <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#f1f5f9' }}>Confirm Your Request</h1>
          <p style={{ color:'#64748b', marginTop:'4px' }}>Review the details before submitting</p>
        </div>

        <div style={{
          background:'rgba(15,23,42,0.8)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'16px', padding:'28px', marginBottom:'24px',
          borderTop:`3px solid ${selectedUrgency?.color || '#6366f1'}`
        }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
            <div style={{
              width:'56px', height:'56px', borderRadius:'14px',
              background: selectedCat?.bg || 'rgba(99,102,241,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
            }}>
              <CatIcon size={26} color={selectedCat?.color || '#6366f1'} />
            </div>
            <div>
              <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'#f1f5f9', marginBottom:'4px' }}>{formData.title}</h2>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <span style={{
                  background: selectedCat?.bg, color: selectedCat?.color,
                  padding:'2px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600
                }}>{selectedCat?.label}</span>
                <span style={{
                  background: `rgba(${selectedUrgency?.color === '#ef4444' ? '239,68,68' : selectedUrgency?.color === '#f97316' ? '249,115,22' : selectedUrgency?.color === '#f59e0b' ? '245,158,11' : '34,197,94'},0.15)`,
                  color: selectedUrgency?.color,
                  padding:'2px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600
                }}>{selectedUrgency?.label} Urgency</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'14px' }}>
              <p style={{ color:'#64748b', fontSize:'0.75rem', marginBottom:'4px' }}>QUANTITY</p>
              <p style={{ color:'#f1f5f9', fontWeight:700, fontSize:'1.1rem' }}>
                {formData.quantity} <span style={{ color:'#64748b', fontSize:'0.8rem', fontWeight:400 }}>{selectedCat?.unit || 'units'}</span>
              </p>
            </div>
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'14px' }}>
              <p style={{ color:'#64748b', fontSize:'0.75rem', marginBottom:'4px' }}>REQUESTER</p>
              <p style={{ color:'#f1f5f9', fontWeight:600, fontSize:'0.9rem' }}>{currentUser?.displayName || currentUser?.email || 'Anonymous'}</p>
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'14px', marginBottom: formData.description ? '12px' : 0 }}>
            <p style={{ color:'#64748b', fontSize:'0.75rem', marginBottom:'4px', display:'flex', alignItems:'center', gap:'6px' }}>
              <MapPin size={11} /> LOCATION
            </p>
            <p style={{ color:'#f1f5f9', fontSize:'0.875rem' }}>{formData.location.address}</p>
            {formData.location.lat && (
              <p style={{ color:'#475569', fontSize:'0.75rem', marginTop:'2px' }}>
                {formData.location.lat.toFixed(5)}, {formData.location.lng.toFixed(5)}
              </p>
            )}
          </div>

          {formData.description && (
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'14px', marginTop:'12px' }}>
              <p style={{ color:'#64748b', fontSize:'0.75rem', marginBottom:'4px' }}>ADDITIONAL DETAILS</p>
              <p style={{ color:'#94a3b8', fontSize:'0.875rem', lineHeight:'1.5' }}>{formData.description}</p>
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => setStep(1)}
            style={{ flex:1, padding:'12px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#cbd5e1', fontWeight:600, cursor:'pointer', fontSize:'0.9rem' }}>
            ← Edit
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ flex:2, padding:'12px', borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Raise Request</>}
          </button>
        </div>
      </div>
    );
  }

  // ── Form Screen (Step 1) ────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:'640px', margin:'0 auto', animation:'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#f1f5f9', lineHeight:1.2 }}>Raise a Need</h1>
            <p style={{ color:'#64748b', fontSize:'0.875rem' }}>Submit an emergency resource request</p>
          </div>
        </div>
        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'20px' }}>
          {['Fill Details', 'Preview', 'Submit'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{
                  width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.7rem', fontWeight:700,
                  background: i === 0 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)',
                  color: i === 0 ? '#fff' : '#475569',
                  border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)'
                }}>{i + 1}</div>
                <span style={{ fontSize:'0.75rem', color: i === 0 ? '#a5b4fc' : '#475569', fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
              </div>
              {i < 2 && <ChevronRight size={14} color="#334155" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background:'rgba(15,23,42,0.8)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'28px', backdropFilter:'blur(12px)' }}>

        {/* ── Category ── */}
        <Field label="What do you need? *" error={errors.category}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginTop:'4px' }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button key={cat.id} type="button"
                  onClick={() => { setFormData(p => ({ ...p, category: cat.id })); setErrors(e => ({ ...e, category: undefined })); }}
                  style={{
                    padding:'14px 8px', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s',
                    background: isSelected ? cat.bg : 'rgba(255,255,255,0.03)',
                    border: isSelected ? `2px solid ${cat.color}` : '1.5px solid rgba(255,255,255,0.07)',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}>
                  <Icon size={22} color={isSelected ? cat.color : '#475569'} />
                  <span style={{ fontSize:'0.75rem', fontWeight:600, color: isSelected ? cat.color : '#64748b' }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <div style={{ height:'20px' }} />

        {/* ── Title ── */}
        <Field label="Request Title *" error={errors.title}>
          <input
            id="raise-title"
            type="text"
            value={formData.title}
            onChange={e => { setFormData(p => ({ ...p, title: e.target.value })); setErrors(er => ({ ...er, title: undefined })); }}
            placeholder={selectedCat ? `e.g., ${selectedCat.label} needed at Relief Camp A` : 'Describe what you need...'}
            style={{
              width:'100%', padding:'11px 14px', borderRadius:'10px', fontSize:'0.9rem',
              background:'rgba(255,255,255,0.05)', border: errors.title ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)',
              color:'#f1f5f9', outline:'none', boxSizing:'border-box', transition:'border 0.2s',
            }}
          />
        </Field>

        <div style={{ height:'20px' }} />

        {/* ── Quantity ── */}
        <Field label={`Quantity${selectedCat ? ` (${selectedCat.unit})` : ''} *`} error={errors.quantity}>
          <div style={{ display:'flex', alignItems:'stretch', gap:'0' }}>
            <input
              id="raise-quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={e => { setFormData(p => ({ ...p, quantity: e.target.value })); setErrors(er => ({ ...er, quantity: undefined })); }}
              placeholder="e.g., 50"
              style={{
                flex:1, padding:'11px 14px', borderRadius:'10px 0 0 10px', fontSize:'0.9rem',
                background:'rgba(255,255,255,0.05)', border: errors.quantity ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)',
                borderRight:'none', color:'#f1f5f9', outline:'none', boxSizing:'border-box',
              }}
            />
            <div style={{ padding:'11px 16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.1)', borderLeft:'none', borderRadius:'0 10px 10px 0', color:'#64748b', fontSize:'0.85rem', display:'flex', alignItems:'center', whiteSpace:'nowrap' }}>
              {selectedCat?.unit || 'units'}
            </div>
          </div>
        </Field>

        <div style={{ height:'20px' }} />

        {/* ── Urgency ── */}
        <Field label="Urgency Level *" error={errors.urgency}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px', marginTop:'4px' }}>
            {URGENCY_LEVELS.map(u => {
              const isSelected = formData.urgency === u.id;
              return (
                <button key={u.id} type="button"
                  onClick={() => { setFormData(p => ({ ...p, urgency: u.id })); setErrors(e => ({ ...e, urgency: undefined })); }}
                  style={{
                    padding:'12px 14px', borderRadius:'10px', cursor:'pointer', transition:'all 0.2s', textAlign:'left',
                    background: isSelected ? `rgba(${u.id === 'critical' ? '239,68,68' : u.id === 'high' ? '249,115,22' : u.id === 'medium' ? '245,158,11' : '34,197,94'},0.12)` : 'rgba(255,255,255,0.03)',
                    border: isSelected ? `1.5px solid ${u.border}` : '1.5px solid rgba(255,255,255,0.07)',
                  }}>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color: isSelected ? u.color : '#64748b', marginBottom:'2px' }}>{u.label}</div>
                  <div style={{ fontSize:'0.72rem', color: isSelected ? u.color + 'aa' : '#475569' }}>{u.desc}</div>
                </button>
              );
            })}
          </div>
        </Field>

        <div style={{ height:'20px' }} />

        {/* ── Location ── */}
        <Field label="Location *" error={errors.location}>
          <div style={{ display:'flex', gap:'8px' }}>
            <input
              id="raise-location"
              type="text"
              value={formData.location.address}
              onChange={e => { setFormData(p => ({ ...p, location: { ...p.location, address: e.target.value } })); setErrors(er => ({ ...er, location: undefined })); }}
              placeholder="Type address or use GPS →"
              style={{
                flex:1, padding:'11px 14px', borderRadius:'10px', fontSize:'0.9rem',
                background:'rgba(255,255,255,0.05)', border: errors.location ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)',
                color:'#f1f5f9', outline:'none', boxSizing:'border-box',
              }}
            />
            <button type="button" onClick={detectGPS} disabled={gpsLoading}
              title="Auto-detect GPS location"
              style={{
                padding:'11px 14px', borderRadius:'10px', cursor:'pointer',
                background: formData.location.lat ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
                border: formData.location.lat ? '1.5px solid rgba(34,197,94,0.4)' : '1.5px solid rgba(99,102,241,0.4)',
                display:'flex', alignItems:'center', gap:'6px', color: formData.location.lat ? '#22c55e' : '#818cf8',
                fontWeight:600, fontSize:'0.8rem', whiteSpace:'nowrap', transition:'all 0.2s',
                opacity: gpsLoading ? 0.6 : 1
              }}>
              {gpsLoading
                ? <Loader2 size={16} className="animate-spin" />
                : <Navigation size={16} />}
              {gpsLoading ? 'Detecting...' : formData.location.lat ? 'GPS ✓' : 'Use GPS'}
            </button>
          </div>
          {formData.location.lat && (
            <p style={{ color:'#475569', fontSize:'0.72rem', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
              <MapPin size={10} /> {formData.location.lat.toFixed(5)}, {formData.location.lng.toFixed(5)}
            </p>
          )}
        </Field>

        <div style={{ height:'20px' }} />

        {/* ── Description ── */}
        <Field label="Additional Details (Optional)">
          <textarea
            id="raise-description"
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Any special instructions, accessibility needs, contact info..."
            rows={3}
            style={{
              width:'100%', padding:'11px 14px', borderRadius:'10px', fontSize:'0.9rem',
              background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)',
              color:'#f1f5f9', outline:'none', boxSizing:'border-box', resize:'vertical',
              lineHeight:'1.5', fontFamily:'inherit',
            }}
          />
        </Field>

        <div style={{ height:'24px' }} />

        {/* ── Actions ── */}
        <div style={{ display:'flex', gap:'12px' }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ flex:1, padding:'13px', borderRadius:'10px', background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontWeight:600, cursor:'pointer', fontSize:'0.9rem', transition:'all 0.2s' }}>
            Cancel
          </button>
          <button type="button"
            onClick={() => {
              if (validate()) setStep(2);
              else toast.error('Please fill all required fields');
            }}
            style={{ flex:2, padding:'13px', borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow:'0 4px 20px rgba(99,102,241,0.4)', transition:'all 0.2s' }}>
            Preview Request <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiseRequest;
