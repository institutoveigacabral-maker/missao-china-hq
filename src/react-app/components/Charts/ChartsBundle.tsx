import React from 'react';
// This would contain all chart-related components
// Grouped together for better code splitting

export { default as SkuAnalysisPanel } from '../SkuAnalysisPanel';
export { default as SearchAnalytics } from '../SearchAnalytics';
export { default as MetricCard } from '../MetricCard';

// Main charts bundle export
const ChartsBundle = {
  SkuAnalysisPanel: React.lazy(() => import('../SkuAnalysisPanel')),
  SearchAnalytics: React.lazy(() => import('../SearchAnalytics')), 
  MetricCard: React.lazy(() => import('../MetricCard')),
};

export default ChartsBundle;
