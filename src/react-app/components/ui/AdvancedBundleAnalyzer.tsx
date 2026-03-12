import { useState } from 'react';
import { Package, BarChart3, Clock, AlertTriangle, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import { useBundleMetrics } from '../../hooks/useBundleMetrics';

export function AdvancedBundleAnalyzer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { 
    metrics, 
    chunks, 
    loadingStats, 
    strategy, 
    suggestions, 
    isLoading, 
    error,
    refreshData,
    optimizeResourceHints,
    resetAnalysis 
  } = useBundleMetrics(autoRefresh, 10000);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getSizeColor = (size: number): string => {
    if (size < 100000) return 'text-green-500'; // < 100KB
    if (size < 500000) return 'text-yellow-500'; // < 500KB
    return 'text-red-500'; // > 500KB
  };

  const getOverallScore = (): { score: number; color: string; label: string } => {
    let score = 100;
    
    // Deduct points for large bundle size
    if (metrics.totalSize > 2000000) score -= 30;
    else if (metrics.totalSize > 1000000) score -= 15;
    
    // Deduct points for poor chunk splitting
    if (metrics.lazyChunks < 3) score -= 20;
    
    // Deduct points for large individual chunks
    const largeChunks = chunks.filter(c => c.size > 500000).length;
    score -= largeChunks * 10;
    
    // Deduct points for slow loading
    const slowChunks = Object.values(loadingStats).filter(time => time > 1000).length;
    score -= slowChunks * 15;
    
    score = Math.max(0, Math.min(100, score));
    
    let color = 'text-green-500';
    let label = 'Excellent';
    
    if (score < 70) {
      color = 'text-red-500';
      label = 'Needs Work';
    } else if (score < 85) {
      color = 'text-yellow-500';
      label = 'Good';
    }
    
    return { score: Math.round(score), color, label };
  };

  const overallScore = getOverallScore();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-20 right-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105"
        title="Advanced Bundle Analyzer"
      >
        <Package className="w-5 h-5" />
        {/* Score Badge */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold ${overallScore.color}`}>
          {overallScore.score}
        </div>
      </button>

      {/* Analysis Panel */}
      {isExpanded && (
        <div className="fixed bottom-32 right-4 z-40 w-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Bundle Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time performance monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
                  title="Refresh Now"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {error ? (
              <div className="p-4 text-center text-red-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p>{error}</p>
                <button
                  onClick={refreshData}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Overall Score */}
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className={`text-3xl font-bold ${overallScore.color} mb-1`}>
                    {overallScore.score}/100
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{overallScore.label}</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        overallScore.score >= 85 ? 'bg-green-500' : 
                        overallScore.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${overallScore.score}%` }}
                    />
                  </div>
                </div>

                {/* Bundle Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatSize(metrics.totalSize)}
                    </div>
                    <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Size</div>
                    <div className="text-xs text-gray-500">
                      {formatSize(metrics.totalGzipSize)} gzipped
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {metrics.chunkCount}
                    </div>
                    <div className="text-xs text-green-600/70 dark:text-green-400/70">Total Chunks</div>
                    <div className="text-xs text-gray-500">
                      {metrics.lazyChunks} lazy loaded
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {formatSize(metrics.vendorSize)}
                    </div>
                    <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Vendor Size</div>
                    <div className="text-xs text-gray-500">
                      {Math.round((metrics.vendorSize / metrics.totalSize) * 100)}% of total
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      {formatSize(metrics.applicationSize)}
                    </div>
                    <div className="text-xs text-orange-600/70 dark:text-orange-400/70">App Size</div>
                    <div className="text-xs text-gray-500">
                      {Math.round((metrics.applicationSize / metrics.totalSize) * 100)}% of total
                    </div>
                  </div>
                </div>

                {/* Top Chunks */}
                {chunks.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Largest Chunks
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {chunks.slice(0, 8).map((chunk, index) => (
                        <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              chunk.isVendor ? 'bg-blue-500' : 
                              chunk.isLazy ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {chunk.name}
                            </span>
                            {chunk.isLazy && <span className="text-xs text-green-500 flex-shrink-0">lazy</span>}
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
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

                {/* Loading Performance */}
                {Object.keys(loadingStats).length > 0 && (
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Clock className="w-4 h-4 mr-2" />
                      Loading Performance
                    </h4>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {Object.entries(loadingStats).slice(0, 6).map(([chunk, time]) => (
                        <div key={chunk} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
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

                {/* Resource Strategy */}
                {(strategy.preload.length > 0 || strategy.prefetch.length > 0) && (
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Zap className="w-4 h-4 mr-2" />
                      Loading Strategy
                    </h4>
                    <div className="space-y-2 text-xs">
                      {strategy.preload.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-600 dark:text-blue-400 font-medium min-w-0 flex-shrink-0">Preload:</span>
                          <span className="text-gray-600 dark:text-gray-400 break-words">
                            {strategy.preload.join(', ')}
                          </span>
                        </div>
                      )}
                      {strategy.prefetch.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <span className="text-green-600 dark:text-green-400 font-medium min-w-0 flex-shrink-0">Prefetch:</span>
                          <span className="text-gray-600 dark:text-gray-400 break-words">
                            {strategy.prefetch.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={optimizeResourceHints}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Apply Resource Hints
                    </button>
                  </div>
                )}

                {/* Optimization Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Optimization Suggestions
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="text-xs text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={resetAnalysis}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset Analysis
                  </button>
                  <button
                    onClick={() => window.open('/bundle-monitor-demo', '_blank')}
                    className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded text-xs hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                  >
                    Full Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
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
