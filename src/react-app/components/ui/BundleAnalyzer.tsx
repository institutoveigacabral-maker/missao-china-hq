import { useState } from 'react';
import { Package, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { useBundleMetrics } from '../../hooks/useBundleMetrics';

export function BundleAnalyzer() {
  const [isVisible, setIsVisible] = useState(false);
  const { chunks, loadingStats, suggestions, metrics } = useBundleMetrics(true, 10000);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getSizeColor = (size: number): string => {
    if (size < 100000) return 'text-green-500'; // < 100KB
    if (size < 500000) return 'text-yellow-500'; // < 500KB
    return 'text-red-500'; // > 500KB
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Bundle Analyzer"
      >
        <Package className="w-5 h-5" />
      </button>

      {/* Analysis Panel */}
      {isVisible && (
        <div className="fixed bottom-32 right-4 z-40 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Bundle Analysis</h3>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Bundle Overview */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatSize(metrics.totalSize)}
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Size</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {metrics.chunkCount}
                </div>
                <div className="text-xs text-green-600/70 dark:text-green-400/70">Chunks</div>
              </div>
            </div>

            {/* Chunk Analysis */}
            {chunks.length > 0 && (
              <div>
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Top Chunks
                </h4>
                <div className="space-y-2">
                  {chunks.slice(0, 6).map((chunk, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          chunk.isVendor ? 'bg-blue-500' : 
                          chunk.isLazy ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                          {chunk.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`${getSizeColor(chunk.size)}`}>
                          {formatSize(chunk.size)}
                        </div>
                        {chunk.gzipSize && (
                          <div className="text-gray-500">
                            {formatSize(chunk.gzipSize)} gz
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Load Times */}
            {Object.keys(loadingStats).length > 0 && (
              <div>
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Load Times
                </h4>
                <div className="space-y-1">
                  {Object.entries(loadingStats).slice(0, 5).map(([chunk, time]) => (
                    <div key={chunk} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[140px]">
                        {chunk}
                      </span>
                      <span className={`${
                        time < 500 ? 'text-green-500' : 
                        time < 1000 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {time.toFixed(0)}ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimization Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Suggestions
                </h4>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="text-xs text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chunks.length === 0 && Object.keys(loadingStats).length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Loading analysis data...
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Bundle Analysis • Development Mode
              <br />
              <span className="font-mono">npm run analyze</span> for detailed stats
            </div>
          </div>
        </div>
      )}
    </>
  );
}
