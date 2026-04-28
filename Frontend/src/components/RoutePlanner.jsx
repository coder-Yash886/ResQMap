import React from 'react';
import { useMapEvents, Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
        <Popup className="custom-popup" autoPan={false}>
          <div className="bg-dark-surface p-2 rounded-lg text-sm">
            <h4 className="font-bold text-red-500 mb-1">Disaster Zone</h4>
            <p className="text-gray-600 mb-1">Nearest: <span className="text-gray-900 font-bold">{route.resource.title}</span></p>
            <p className="text-gray-600">Distance: <span className="text-gray-900 font-bold">{route.distance} km</span></p>
            <p className="text-gray-600">ETA: <span className="text-gray-900 font-bold">{route.eta} mins</span> (at 40km/h)</p>
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
