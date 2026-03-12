import React from 'react';
// This would contain all map-related components

export { default as CantonFairMap } from '../CantonFairMap';

// Main maps bundle export  
const MapBundle = {
  CantonFairMap: React.lazy(() => import('../CantonFairMap')),
};

export default MapBundle;
