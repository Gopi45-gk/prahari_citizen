export const MAP_CONFIG = {
  defaultCenter: [13.0827, 80.2707], // Default to Chennai as per mock data
  defaultZoom: 13,
  minZoom: 2,
  maxZoom: 19,
};

export const LAYERS = {
  base: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  railway: {
    url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>',
    opacity: 0.8
  }
};
