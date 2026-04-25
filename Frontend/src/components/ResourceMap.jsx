import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TYPE_COLORS, TYPE_ICONS } from '../utils/constants';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import HeatmapLayer from './HeatmapLayer';
import RoutePlanner from './RoutePlanner';
import { Zap, ZapOff, NavigationOff } from 'lucide-react';

// Fix Leaflet's default icon path issues with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom HTML icon generator
const createCustomIcon = (type) => {
  const iconEmoji = TYPE_ICONS[type] || '📦';
  const colorName = TYPE_COLORS[type] || 'gray';
  
  const bgColors = {
    green: 'bg-status-available',
    blue: 'bg-[#3B82F6]',
    amber: 'bg-status-allocated',
    purple: 'bg-[#A855F7]',
    orange: 'bg-accent-primary',
    gray: 'bg-gray-500'
  };

  const bgColor = bgColors[colorName];

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative group cursor-pointer">
        <div class="absolute -inset-1 ${bgColor} rounded-full blur opacity-40 group-hover:opacity-75 transition duration-200 animate-pulse-urgent"></div>
        <div class="relative w-10 h-10 ${bgColor} rounded-full border-2 border-dark-base flex items-center justify-center shadow-xl z-10 transform transition-transform group-hover:scale-110">
          <span class="text-xl">${iconEmoji}</span>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-dark-base z-20"></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48]
  });
};

const ResourceMap = ({ resources: initialResources }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [route, setRoute] = useState(null);
  const [liveResources, setLiveResources] = useState([]);
  
  const { isConnected, lastMessage } = useWebSocket('ws://localhost:5000');

  // Initialize live resources with the prop resources
  useEffect(() => {
    setLiveResources(initialResources);
  }, [initialResources]);

  // Update live resources when a new WebSocket message arrives
  useEffect(() => {
    if (lastMessage && lastMessage.id) {
      setLiveResources(prev => {
        const existingIdx = prev.findIndex(r => (r._id || r.id) === lastMessage.id);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...lastMessage };
          return updated;
        }
        return [...prev, lastMessage];
      });
    }
  }, [lastMessage]);

  // Default center (can be user's location or disaster epicenter)
  // Coordinates are roughly Delhi/India for context, but can be anywhere
  const defaultCenter = [28.6139, 77.2090]; 

  // Prepare points for the heatmap
  const heatmapPoints = useMemo(() => {
    return liveResources.map(res => {
      const status = res.status?.toLowerCase();
      let weight = 0;
      if (status === 'available') weight = 0.2;
      else if (status === 'allocated') weight = 0.6;
      else if (status === 'completed') weight = 0.1;
      return [res.lat, res.lng, weight];
    });
  }, [liveResources]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-dark-border shadow-lg relative z-0">
      
      {/* UI Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-dark-base/80 backdrop-blur-md px-3 py-2 rounded-lg border border-dark-border flex items-center gap-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase text-white tracking-wider">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md font-bold text-xs transition-all shadow-lg
            ${showHeatmap ? 'bg-accent-primary border-orange-500 text-white' : 'bg-dark-base/80 border-dark-border text-gray-300 hover:text-white hover:bg-dark-surface'}`}
        >
          {showHeatmap ? <Zap size={14} /> : <ZapOff size={14} />}
          {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
        </button>

        {route && (
          <button 
            onClick={() => setRoute(null)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/90 hover:bg-red-500 border border-red-400 backdrop-blur-md font-bold text-xs text-white transition-all shadow-lg"
          >
            <NavigationOff size={14} />
            Clear Route
          </button>
        )}
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#0A0F1A' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <HeatmapLayer points={heatmapPoints} isVisible={showHeatmap} />
        
        <RoutePlanner resources={liveResources} route={route} setRoute={setRoute} />
        
        {liveResources.map((resource) => {
          if (!resource.lat || !resource.lng) return null;
          
          return (
            <Marker 
              key={resource._id || resource.id} 
              position={[resource.lat, resource.lng]}
              icon={createCustomIcon(resource.type?.toLowerCase())}
            >
              <Popup className="custom-popup">
                <div className="bg-dark-surface p-1 rounded-lg">
                  <h3 className="font-syne font-bold text-gray-900 mb-1">{resource.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs uppercase font-bold text-gray-500">{resource.type}</span>
                  </div>
                  <div className="mb-2">
                    <StatusBadge status={resource.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Qty: {resource.quantity}</p>
                  <Link 
                    to={`/resources/${resource._id || resource.id}`}
                    className="block w-full text-center bg-accent-primary hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Required CSS to override Leaflet default styles to match dark theme */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 12px;
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip {
          background: #ffffff;
        }
        .leaflet-container {
          font-family: 'DM Sans', sans-serif;
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
};

export default ResourceMap;
