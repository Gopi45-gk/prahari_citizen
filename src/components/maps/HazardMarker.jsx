import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { AlertTriangle } from 'lucide-react';

const createCustomIcon = (color, shadow) => {
  const html = renderToString(
    <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg text-white border-2 border-white ${color} ${shadow}`}>
      <AlertTriangle className="w-4 h-4" />
    </div>
  );

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

export default function HazardMarker({ alert, onClick }) {
  const customIcon = createCustomIcon(alert.color, alert.shadow);

  return (
    <Marker 
      position={alert.coordinates} 
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onClick) onClick(alert);
        },
      }}
    />
  );
}
