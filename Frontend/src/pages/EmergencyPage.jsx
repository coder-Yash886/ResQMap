import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity, AlertTriangle, Hospital, Shield, Flame,
  RefreshCw, MapPin, Clock, Wifi, WifiOff, Zap, Loader2
} from 'lucide-react';

// ── Map center flyTo helper ───────────────────────────────────────────────────
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 12, { duration: 1.5 }); }, [center, map]);
  return null;
};

// ── Urgency badge helpers ─────────────────────────────────────────────────────
const getMagColor = (mag) => {
  if (mag >= 6) return '#ef4444';
  if (mag >= 4) return '#f97316';
  if (mag >= 3) return '#f59e0b';
  return '#22c55e';
};

const getWeatherAlert = (code) => {
  if (code >= 95) return { label: 'Thunderstorm', color: '#ef4444' };
  if (code >= 80) return { label: 'Heavy Rain', color: '#f97316' };
  if (code >= 60) return { label: 'Rain', color: '#3b82f6' };
  if (code >= 45) return { label: 'Fog', color: '#94a3b8' };
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────
const EmergencyPage = () => {
  const [userLoc, setUserLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const [earthquakes, setEarthquakes] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [gdacsAlerts, setGdacsAlerts] = useState([]);

  const timerRef = useRef(null);

  // ── Get user location ──────────────────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      () => { setUserLoc({ lat: 28.6139, lng: 77.2090 }); setLocLoading(false); }, // Default: Delhi
      { timeout: 10000 }
    );
  }, []);

  // ── Fetch all emergency data ───────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!userLoc) return;
    setDataLoading(true);
    setSecondsAgo(0);

    const { lat, lng } = userLoc;

    try {
      await Promise.allSettled([
        // 1. USGS Earthquakes
        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lng}&maxradius=10&minmagnitude=2&orderby=time&limit=20`)
          .then(r => r.json())
          .then(data => {
            const quakes = (data.features || []).map(f => ({
              id: f.id,
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
              mag: f.properties.mag,
              place: f.properties.place,
              time: new Date(f.properties.time),
              depth: f.geometry.coordinates[2],
            }));
            setEarthquakes(quakes);
          })
          .catch(() => setEarthquakes([])),

        // 2. Open-Meteo weather codes
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code&timezone=auto&forecast_days=1`)
          .then(r => r.json())
          .then(data => {
            const codes = data?.daily?.weather_code || [];
            const alerts = codes
              .map(c => getWeatherAlert(c))
              .filter(Boolean)
              .filter((v, i, a) => a.findIndex(x => x.label === v.label) === i);
            setWeatherAlerts(alerts);
          })
          .catch(() => setWeatherAlerts([])),

        // 3. OpenStreetMap Overpass — hospitals + police + fire near user
        fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `[out:json][timeout:15];
(
  node["amenity"="hospital"](around:10000,${lat},${lng});
  node["amenity"="police"](around:10000,${lat},${lng});
  node["amenity"="fire_station"](around:10000,${lat},${lng});
  node["amenity"="pharmacy"](around:10000,${lat},${lng});
);
out body 30;`,
        })
          .then(r => r.json())
          .then(data => {
            const services = (data.elements || []).map(el => ({
              id: el.id,
              lat: el.lat,
              lng: el.lon,
              name: el.tags?.name || el.tags?.amenity,
              type: el.tags?.amenity,
              phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
            }));
            setNearbyServices(services);
          })
          .catch(() => setNearbyServices([])),

        // 4. GDACS RSS → parse for active alerts (CORS proxy approach)
        fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.gdacs.org/xml/rss.xml'))
          .then(r => r.json())
          .then(d => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(d.contents, 'text/xml');
            const items = [...xml.querySelectorAll('item')].slice(0, 8).map(item => ({
              title: item.querySelector('title')?.textContent || '',
              description: item.querySelector('description')?.textContent?.slice(0, 120) || '',
              link: item.querySelector('link')?.textContent || '#',
              pubDate: item.querySelector('pubDate')?.textContent || '',
            }));
            setGdacsAlerts(items);
          })
          .catch(() => setGdacsAlerts([])),
      ]);
    } finally {
      setDataLoading(false);
      setLastUpdated(new Date());
    }
  }, [userLoc]);

  useEffect(() => { if (userLoc) fetchAll(); }, [fetchAll]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => { if (userLoc) fetchAll(); }, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Seconds counter
  useEffect(() => {
    timerRef.current = setInterval(() => setSecondsAgo(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [lastUpdated]);

  const serviceColor = (type) => {
    if (type === 'hospital') return '#3b82f6';
    if (type === 'police') return '#6366f1';
    if (type === 'fire_station') return '#ef4444';
    return '#22c55e';
  };

  const serviceIcon = (type) => {
    if (type === 'hospital') return '🏥';
    if (type === 'police') return '👮';
    if (type === 'fire_station') return '🚒';
    return '💊';
  };

  const haversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // Nearest service per type
  const nearest = {};
  if (userLoc) {
    ['hospital', 'police', 'fire_station'].forEach(t => {
      const filtered = nearbyServices.filter(s => s.type === t);
      if (filtered.length) {
        nearest[t] = filtered.reduce((a, b) =>
          haversine(userLoc.lat, userLoc.lng, a.lat, a.lng) < haversine(userLoc.lat, userLoc.lng, b.lat, b.lng) ? a : b
        );
      }
    });
  }

  const maxMag = earthquakes.length ? Math.max(...earthquakes.map(e => e.mag)) : 0;
  const mapCenter = userLoc ? [userLoc.lat, userLoc.lng] : [28.6139, 77.2090];

  // ─────────────────────────────────────────────────────────────────────────
  const Card = ({ children, style = {} }) => (
    <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '14px', padding: '16px', ...style }}>
      {children}
    </div>
  );

  const SectionTitle = ({ icon: Icon, label, color = '#E8650A' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <Icon size={15} color={color} />
      <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>{label}</h3>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
            🛰️ Emergency Intelligence
          </h1>
          <p style={{ color: '#4b5563', marginTop: '4px', fontSize: '0.875rem' }}>
            Real-time disaster data · 10km radius around you
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdated && (
            <span style={{ color: '#374151', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} />
              Updated {secondsAgo}s ago
            </span>
          )}
          <button onClick={fetchAll} disabled={dataLoading || locLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: dataLoading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {locLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '12px', color: '#4b5563' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#E8650A' }} />
          <span>Locating you...</span>
        </div>
      ) : (
        <>
          {/* ── Quick Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Nearby Services',    value: nearbyServices.length, color: '#3b82f6', icon: '🏥' },
              { label: 'Recent Earthquakes', value: earthquakes.length,    color: maxMag >= 5 ? '#ef4444' : '#f59e0b', icon: '🌍', sub: maxMag > 0 ? `Max M${maxMag.toFixed(1)}` : '' },
              { label: 'Weather Alerts',     value: weatherAlerts.length,  color: weatherAlerts.length ? '#f97316' : '#22c55e', icon: '🌩️', sub: weatherAlerts[0]?.label || 'Clear' },
              { label: 'Global Alerts',      value: gdacsAlerts.length,    color: '#a855f7', icon: '🌐' },
            ].map(s => (
              <Card key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '2px' }}>{s.label}</div>
                {s.sub && <div style={{ color: s.color, fontSize: '0.68rem', marginTop: '2px', fontWeight: 700 }}>{s.sub}</div>}
              </Card>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>
            {/* ── LEFT: Map ── */}
            <div>
              <Card style={{ padding: 0, overflow: 'hidden', height: '480px' }}>
                {dataLoading && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: 'rgba(17,24,39,0.9)', padding: '6px 12px', borderRadius: '8px', color: '#E8650A', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Fetching data...
                  </div>
                )}
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CartoDB'
                  />
                  <MapController center={mapCenter} />

                  {/* User location */}
                  {userLoc && (
                    <CircleMarker center={[userLoc.lat, userLoc.lng]} radius={10}
                      pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.6, weight: 3 }}>
                      <Popup><strong>📍 Your Location</strong></Popup>
                    </CircleMarker>
                  )}

                  {/* Earthquakes */}
                  {earthquakes.map(q => (
                    <CircleMarker key={q.id} center={[q.lat, q.lng]} radius={Math.max(6, q.mag * 4)}
                      pathOptions={{ color: getMagColor(q.mag), fillColor: getMagColor(q.mag), fillOpacity: 0.5, weight: 2 }}>
                      <Popup>
                        <div style={{ fontSize: '13px' }}>
                          <strong>🌍 Earthquake M{q.mag.toFixed(1)}</strong><br />
                          {q.place}<br />
                          Depth: {q.depth.toFixed(1)}km<br />
                          {q.time.toLocaleString()}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}

                  {/* Nearby services */}
                  {nearbyServices.map(s => (
                    <CircleMarker key={s.id} center={[s.lat, s.lng]} radius={7}
                      pathOptions={{ color: serviceColor(s.type), fillColor: serviceColor(s.type), fillOpacity: 0.8, weight: 2 }}>
                      <Popup>
                        <div style={{ fontSize: '13px' }}>
                          <strong>{serviceIcon(s.type)} {s.name || s.type}</strong><br />
                          {s.type?.replace('_', ' ')}<br />
                          {s.phone && <span>📞 {s.phone}</span>}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </Card>

              {/* Map Legend */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px', padding: '0 4px' }}>
                {[
                  { color: '#3b82f6', label: 'Your Location' },
                  { color: '#ef4444', label: 'Earthquake (High)' },
                  { color: '#f59e0b', label: 'Earthquake (Low)' },
                  { color: '#3b82f6', label: 'Hospital' },
                  { color: '#6366f1', label: 'Police' },
                  { color: '#ef4444', label: 'Fire Station' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#6b7280' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Sidebar Panel ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Nearest Services */}
              <Card>
                <SectionTitle icon={MapPin} label="Nearest Emergency Services" />
                {Object.keys(nearest).length === 0 && !dataLoading ? (
                  <p style={{ color: '#374151', fontSize: '0.8rem' }}>No services found nearby</p>
                ) : (
                  Object.entries(nearest).map(([type, s]) => {
                    const dist = userLoc ? haversine(userLoc.lat, userLoc.lng, s.lat, s.lng) : 0;
                    return (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{serviceIcon(type)}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name || type.replace('_', ' ')}</div>
                          <div style={{ color: '#4b5563', fontSize: '0.72rem' }}>{dist.toFixed(1)}km away{s.phone ? ` · ${s.phone}` : ''}</div>
                        </div>
                        <div style={{ color: serviceColor(type), fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{dist.toFixed(1)}km</div>
                      </div>
                    );
                  })
                )}
              </Card>

              {/* Weather Alerts */}
              <Card>
                <SectionTitle icon={Activity} label="Weather Alerts" color="#f97316" />
                {weatherAlerts.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.82rem' }}>
                    <span>✅</span> No active weather alerts
                  </div>
                ) : (
                  weatherAlerts.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: `${a.color}12`, border: `1px solid ${a.color}30`, borderRadius: '8px', marginBottom: '6px' }}>
                      <AlertTriangle size={14} color={a.color} />
                      <span style={{ color: a.color, fontWeight: 700, fontSize: '0.82rem' }}>{a.label}</span>
                    </div>
                  ))
                )}
              </Card>

              {/* Earthquakes */}
              <Card>
                <SectionTitle icon={Zap} label={`Earthquakes (${earthquakes.length})`} color="#f59e0b" />
                {earthquakes.length === 0 ? (
                  <p style={{ color: '#374151', fontSize: '0.8rem' }}>No recent earthquakes</p>
                ) : (
                  <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                    {earthquakes.slice(0, 6).map(q => (
                      <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(30,45,69,0.5)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${getMagColor(q.mag)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: getMagColor(q.mag), fontWeight: 800, fontSize: '0.72rem' }}>
                          M{q.mag.toFixed(1)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#d1d5db', fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.place}</div>
                          <div style={{ color: '#374151', fontSize: '0.68rem' }}>Depth {q.depth.toFixed(0)}km · {q.time.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* GDACS Global Alerts */}
              <Card>
                <SectionTitle icon={Shield} label="Global Disaster Alerts (GDACS)" color="#a855f7" />
                {gdacsAlerts.length === 0 ? (
                  <p style={{ color: '#374151', fontSize: '0.8rem' }}>Loading global alerts...</p>
                ) : (
                  <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    {gdacsAlerts.slice(0, 5).map((a, i) => (
                      <a key={i} href={a.link} target="_blank" rel="noreferrer"
                        style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid rgba(30,45,69,0.5)', textDecoration: 'none' }}>
                        <div style={{ color: '#d1d5db', fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                        <div style={{ color: '#374151', fontSize: '0.68rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description}</div>
                      </a>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

export default EmergencyPage;
