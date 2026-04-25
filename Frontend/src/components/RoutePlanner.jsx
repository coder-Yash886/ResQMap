import React from 'react';
import { useMapEvents, Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Custom icon for disaster point
const disasterIcon = L.divIcon({
  className: 'disaster-marker',
  html: `<div class="w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-ping"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const RoutePlanner = ({ resources, route, setRoute }) => {
  useMapEvents({
    click(e) {
      const disasterLat = e.latlng.lat;
      const disasterLng = e.latlng.lng;

      let nearest = null;
      let minDistance = Infinity;

      resources.forEach(res => {
        // Find nearest available resource (fallback to any if non available, but prioritize available)
        if (res.lat && res.lng && res.status?.toLowerCase() !== 'completed') {
          const dist = calculateDistance(disasterLat, disasterLng, res.lat, res.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = res;
          }
        }
      });

      if (nearest) {
        const etaMins = Math.round((minDistance / 40) * 60);

        setRoute({
          disasterPoint: [disasterLat, disasterLng],
          resourcePoint: [nearest.lat, nearest.lng],
          resource: nearest,
          distance: minDistance.toFixed(2),
          eta: etaMins
        });
      }
    }
  });

  if (!route) return null;

  return (
    <>
      <Marker position={route.disasterPoint} icon={disasterIcon}>
        <Popup className="dark-popup" autoPan={false}>
          <div className="p-3 flex flex-col gap-1 text-sm text-[#e5e7eb]">
            <h4 className="font-bold text-[#E8650A] mb-1 pb-1 border-b border-[#E8650A]/30">Disaster Zone</h4>
            <p>Nearest: <span className="text-white font-bold">{route.resource.title}</span></p>
            <p>Distance: <span className="text-white font-bold">{route.distance} km</span></p>
            <p>ETA: <span className="text-white font-bold">{route.eta} mins</span> (at 40km/h)</p>
          </div>
        </Popup>
      </Marker>
      <Polyline 
        positions={[route.resourcePoint, route.disasterPoint]} 
        color="#E8650A" 
        weight={4}
        dashArray="10, 10"
        className="animate-dash"
      />
    </>
  );
};

export default RoutePlanner;
