import { useState, useCallback } from 'react';

export function useRailwayMap() {
  const [mapInstance, setMapInstance] = useState(null);

  const zoomIn = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  }, [mapInstance]);

  const zoomOut = useCallback(() => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  }, [mapInstance]);

  const locateMe = useCallback(() => {
    if (mapInstance) {
      mapInstance.locate({ setView: true, maxZoom: 16 });
    }
  }, [mapInstance]);

  return {
    mapInstance,
    setMapInstance,
    zoomIn,
    zoomOut,
    locateMe
  };
}
