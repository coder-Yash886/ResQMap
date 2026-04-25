import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points, isVisible }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    // points format: [lat, lng, intensity]
    const heatPoints = points.filter(p => p[0] && p[1]);

    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: 'blue',
          0.6: 'yellow',
          1.0: 'red'
        }
      }).addTo(map);
    } else {
      heatLayerRef.current.setLatLngs(heatPoints);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [points, isVisible, map]);

  return null;
};

export default HeatmapLayer;
