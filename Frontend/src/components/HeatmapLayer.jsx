import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const HeatmapLayer = ({ points, isVisible }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Inject L globally for leaflet.heat compatibility in Vite
    if (typeof window !== 'undefined') {
      window.L = L;
    }
    
    // Dynamically import to ensure window.L exists first
    import('leaflet.heat').then(() => {
      setIsReady(true);
    }).catch(err => console.error("Failed to load leaflet.heat", err));
  }, []);

  useEffect(() => {
    if (!isReady) return;

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
      if (typeof L.heatLayer === 'function') {
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
        console.warn('L.heatLayer is still not available.');
      }
    } else {
      heatLayerRef.current.setLatLngs(heatPoints);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [points, isVisible, map, isReady]);

  return null;
};

export default HeatmapLayer;
