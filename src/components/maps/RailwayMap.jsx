import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG, LAYERS } from '../../services/openRailwayMap';
import HazardMarker from './HazardMarker';

// Bridge to allow the parent component (and its hooks) to access the Leaflet map instance
function MapInstanceBridge({ setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  return null;
}

// User location icon mimicking the existing UI pulsating dot
const userIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 32px; height: 32px;">
      <div class="bg-blue-500/20 rounded-full animate-ping absolute" style="top: -16px; left: -16px; width: 64px; height: 64px;"></div>
      <div class="bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500 relative z-10" style="width: 32px; height: 32px;">
        <div class="bg-blue-600 rounded-full" style="width: 12px; height: 12px;"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function RailwayMap({ alerts, onAlertClick, setMapInstance }) {
  return (
    <MapContainer 
      center={MAP_CONFIG.defaultCenter} 
      zoom={MAP_CONFIG.defaultZoom} 
      zoomControl={false} // Disable default zoom controls to use existing UI buttons
      attributionControl={false} // Optional: hide to keep UI super clean, or move it.
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    >
      <MapInstanceBridge setMapInstance={setMapInstance} />
      
      {/* Base Layer: OpenStreetMap */}
      <TileLayer
        url={LAYERS.base.url}
        attribution={LAYERS.base.attribution}
      />
      
      {/* Overlay: OpenRailwayMap */}
      <TileLayer
        url={LAYERS.railway.url}
        attribution={LAYERS.railway.attribution}
        opacity={LAYERS.railway.opacity}
      />

      {/* User Location */}
      <Marker position={MAP_CONFIG.defaultCenter} icon={userIcon} />

      {/* Hazard Alerts */}
      {alerts.map(alert => (
        <HazardMarker 
          key={alert.id} 
          alert={alert} 
          onClick={onAlertClick} 
        />
      ))}
    </MapContainer>
  );
}
