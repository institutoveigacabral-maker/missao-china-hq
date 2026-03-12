import { useState } from 'react';
import { Activity, BarChart3, Clock, Monitor, Zap } from 'lucide-react';
import { usePerformance } from '../hooks/usePerformance';

interface PerformanceDevToolsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function PerformanceDevTools({ isOpen = false, onToggle }: PerformanceDevToolsProps) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { metrics, isLoading, refresh } = usePerformance();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleToggle = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.();
  };

  const getMetricColor = (value: number, thresholds: [number, number]) => {
    const [good, needs] = thresholds;
    if (value <= good) return 'text-green-500';
    if (value <= needs) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricStatus = (value: number, thresholds: [number, number]) => {
    const [good, needs] = thresholds;
    if (value <= good) return 'Good';
    if (value <= needs) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance DevTools"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-40 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Performance</h3>
              </div>
              <button
                onClick={refresh}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Refresh metrics"
              >
                <BarChart3 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* First Contentful Paint */}
                {metrics.fcp && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">FCP</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-mono ${getMetricColor(metrics.fcp, [1800, 3000])}`}>
                        {metrics.fcp.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricStatus(metrics.fcp, [1800, 3000])}
                      </div>
                    </div>
                  </div>
                )}

                {/* Largest Contentful Paint */}
                {metrics.lcp && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">LCP</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-mono ${getMetricColor(metrics.lcp, [2500, 4000])}`}>
                        {metrics.lcp.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricStatus(metrics.lcp, [2500, 4000])}
                      </div>
                    </div>
                  </div>
                )}

                {/* First Input Delay */}
                {metrics.fid && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">FID</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-mono ${getMetricColor(metrics.fid, [100, 300])}`}>
                        {metrics.fid.toFixed(1)}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricStatus(metrics.fid, [100, 300])}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cumulative Layout Shift */}
                {metrics.cls !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">CLS</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-mono ${getMetricColor(metrics.cls, [0.1, 0.25])}`}>
                        {metrics.cls.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricStatus(metrics.cls, [0.1, 0.25])}
                      </div>
                    </div>
                  </div>
                )}

                {/* Time to First Byte */}
                {metrics.ttfb && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">TTFB</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-mono ${getMetricColor(metrics.ttfb, [800, 1800])}`}>
                        {metrics.ttfb.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {getMetricStatus(metrics.ttfb, [800, 1800])}
                      </div>
                    </div>
                  </div>
                )}

                {Object.keys(metrics).length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No metrics available yet
                  </div>
                )}
              </>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Core Web Vitals • Development Mode
            </div>
          </div>
        </div>
      )}
    </>
  );
}
