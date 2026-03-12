import React, { useState, useEffect } from 'react';
import { bundleMonitor } from '@/react-app/utils/bundleMonitor';
import type { BundleMetrics } from '@/react-app/utils/bundleMonitor';

interface BundleMonitorProps {
  className?: string;
}

const BundleMonitor: React.FC<BundleMonitorProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<Partial<BundleMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      setMetrics(bundleMonitor.getMetrics());
    };

    // Initial load
    updateMetrics();

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 2000);

    // Listen for load events
    const handleLoad = () => {
      setTimeout(updateMetrics, 100);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    return `${ms.toFixed(0)}ms`;
  };

  const getPerformanceColor = (metric: string, value: number): string => {
    switch (metric) {
      case 'totalLoadTime':
        if (value < 1000) return 'text-green-400';
        if (value < 3000) return 'text-yellow-400';
        return 'text-red-400';
      case 'totalSize':
        if (value < 500 * 1024) return 'text-green-400'; // < 500KB
        if (value < 1024 * 1024) return 'text-yellow-400'; // < 1MB
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200 text-xs font-mono border border-gray-700"
      >
        📦 Bundle {isVisible ? '▼' : '▶'}
      </button>

      {/* Metrics Panel */}
      {isVisible && (
        <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl p-4 w-80 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">🚀 Bundle Monitor</h3>
            <button
              onClick={() => bundleMonitor.reportBundleSize()}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              Report
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-2 text-xs">
            {metrics.totalLoadTime !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-300">Load Time:</span>
                <span className={getPerformanceColor('totalLoadTime', metrics.totalLoadTime)}>
                  {formatTime(metrics.totalLoadTime)}
                </span>
              </div>
            )}

            {metrics.domContentLoadedTime !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-300">DOM Ready:</span>
                <span className="text-blue-400">
                  {formatTime(metrics.domContentLoadedTime)}
                </span>
              </div>
            )}

            {metrics.totalSize !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-300">Bundle Size:</span>
                <span className={getPerformanceColor('totalSize', metrics.totalSize)}>
                  {formatSize(metrics.totalSize)}
                </span>
              </div>
            )}

            {/* Resource Breakdown */}
            {metrics.resourceCount && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Resources:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>JS:</span>
                    <span className="text-yellow-400">{metrics.resourceCount.js}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSS:</span>
                    <span className="text-blue-400">{metrics.resourceCount.css}</span>
                  </div>
                  {metrics.resourceCount.images > 0 && (
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <span className="text-green-400">{metrics.resourceCount.images}</span>
                    </div>
                  )}
                  {metrics.resourceCount.fonts > 0 && (
                    <div className="flex justify-between">
                      <span>Fonts:</span>
                      <span className="text-purple-400">{metrics.resourceCount.fonts}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Size Breakdown */}
            {(metrics.jsSize || metrics.cssSize) && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Sizes:</div>
                <div className="space-y-1 text-xs">
                  {metrics.jsSize !== undefined && (
                    <div className="flex justify-between">
                      <span>JavaScript:</span>
                      <span className="text-yellow-400">{formatSize(metrics.jsSize)}</span>
                    </div>
                  )}
                  {metrics.cssSize !== undefined && (
                    <div className="flex justify-between">
                      <span>CSS:</span>
                      <span className="text-blue-400">{formatSize(metrics.cssSize)}</span>
                    </div>
                  )}
                  {metrics.imageSize !== undefined && metrics.imageSize > 0 && (
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <span className="text-green-400">{formatSize(metrics.imageSize)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Largest Resources */}
            {metrics.largestResources && metrics.largestResources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Top Resources:</div>
                <div className="space-y-1">
                  {metrics.largestResources.slice(0, 3).map((resource, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="truncate flex-1 mr-2" title={resource.name}>
                        {resource.name}
                      </span>
                      <span className="text-gray-300">{formatSize(resource.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-3 pt-2 border-t border-gray-700 flex gap-1">
            <button
              onClick={() => console.log('Bundle Metrics:', bundleMonitor.exportMetrics())}
              className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleMonitor;
