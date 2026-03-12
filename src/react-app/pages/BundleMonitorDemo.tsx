import { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Download,
  RefreshCw,
  Settings,
  Eye,
  Target,
  Layers
} from 'lucide-react';
import { useBundleMetrics } from '../hooks/useBundleMetrics';

export default function BundleMonitorDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [autoOptimize, setAutoOptimize] = useState(false);
  
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
    // resetAnalysis 
  } = useBundleMetrics(true, refreshInterval);

  useEffect(() => {
    if (autoOptimize && strategy.preload.length > 0) {
      optimizeResourceHints();
    }
  }, [strategy, autoOptimize, optimizeResourceHints]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getSizeColor = (size: number): string => {
    if (size < 100000) return 'text-green-600 dark:text-green-400';
    if (size < 500000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getOverallScore = (): { score: number; color: string; label: string } => {
    let score = 100;
    
    if (metrics.totalSize > 2000000) score -= 30;
    else if (metrics.totalSize > 1000000) score -= 15;
    
    if (metrics.lazyChunks < 3) score -= 20;
    
    const largeChunks = chunks.filter(c => c.size > 500000).length;
    score -= largeChunks * 10;
    
    const slowChunks = Object.values(loadingStats).filter(time => time > 1000).length;
    score -= slowChunks * 15;
    
    score = Math.max(0, Math.min(100, score));
    
    let color = 'text-green-600 dark:text-green-400';
    let label = 'Excellent';
    
    if (score < 70) {
      color = 'text-red-600 dark:text-red-400';
      label = 'Needs Work';
    } else if (score < 85) {
      color = 'text-yellow-600 dark:text-yellow-400';
      label = 'Good';
    }
    
    return { score: Math.round(score), color, label };
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      metrics,
      chunks,
      loadingStats,
      strategy,
      suggestions,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bundle-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const overallScore = getOverallScore();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'chunks', label: 'Chunks', icon: Layers },
    { id: 'performance', label: 'Performance', icon: Clock },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'suggestions', label: 'Suggestions', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bundle Monitor
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time bundle analysis and optimization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Overall Score */}
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${overallScore.color}`}>
                    {overallScore.score}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                </div>
                <div className="text-sm">
                  <div className={`font-medium ${overallScore.color}`}>
                    {overallScore.label}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    Bundle Performance
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
                  title="Refresh Analysis"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={exportData}
                  className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  title="Export Data"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Settings</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-blue-700 dark:text-blue-300">
                    Refresh Interval:
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-sm"
                  >
                    <option value={5000}>5s</option>
                    <option value={10000}>10s</option>
                    <option value={30000}>30s</option>
                    <option value={60000}>1m</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-optimize"
                    checked={autoOptimize}
                    onChange={(e) => setAutoOptimize(e.target.checked)}
                    className="rounded border-blue-300 dark:border-blue-600"
                  />
                  <label htmlFor="auto-optimize" className="text-sm text-blue-700 dark:text-blue-300">
                    Auto-apply optimizations
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
              Analysis Error
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Metrics */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <Package className="w-6 h-6 text-blue-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Total Bundle Size</h3>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {formatSize(metrics.totalSize)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatSize(metrics.totalGzipSize)} gzipped
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <Layers className="w-6 h-6 text-green-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Chunks</h3>
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {metrics.chunkCount}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {metrics.lazyChunks} lazy loaded
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Size Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vendor Code</span>
                        <span className="text-sm font-medium">{formatSize(metrics.vendorSize)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.vendorSize / metrics.totalSize) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Application Code</span>
                        <span className="text-sm font-medium">{formatSize(metrics.applicationSize)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(metrics.applicationSize / metrics.totalSize) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                    <div className={`text-4xl font-bold ${overallScore.color} mb-2`}>
                      {overallScore.score}
                    </div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {overallScore.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Performance Score
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          overallScore.score >= 85 ? 'bg-green-500' : 
                          overallScore.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${overallScore.score}%` }}
                      />
                    </div>
                  </div>

                  {suggestions.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-3">
                        Quick Wins
                      </h3>
                      <div className="space-y-2">
                        {suggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="text-sm text-amber-700 dark:text-amber-300">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                      {suggestions.length > 3 && (
                        <button
                          onClick={() => setActiveTab('suggestions')}
                          className="text-sm text-amber-600 dark:text-amber-400 mt-2 hover:underline"
                        >
                          View all {suggestions.length} suggestions →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chunks' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">Chunk Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Detailed breakdown of all bundle chunks
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Chunk
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Gzipped
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Load Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {chunks.map((chunk, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                chunk.isVendor ? 'bg-blue-500' : 
                                chunk.isLazy ? 'bg-green-500' : 'bg-gray-500'
                              }`} />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {chunk.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${getSizeColor(chunk.size)}`}>
                              {formatSize(chunk.size)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {chunk.gzipSize ? formatSize(chunk.gzipSize) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              chunk.isVendor 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                                : chunk.isLazy 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {chunk.isVendor ? 'Vendor' : chunk.isLazy ? 'Lazy' : 'Main'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {chunk.loadTime ? (
                              <span className={`text-sm ${
                                chunk.loadTime < 500 ? 'text-green-600 dark:text-green-400' : 
                                chunk.loadTime < 1000 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {chunk.loadTime.toFixed(0)}ms
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Loading Times</h3>
                  <div className="space-y-3">
                    {Object.entries(loadingStats).slice(0, 8).map(([chunk, time]) => (
                      <div key={chunk} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 mr-4">
                          {chunk}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                time < 500 ? 'bg-green-500' : 
                                time < 1000 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((time / 2000) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-12 text-right ${
                            time < 500 ? 'text-green-600 dark:text-green-400' : 
                            time < 1000 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {time.toFixed(0)}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Performance Insights</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Average Load Time
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Object.values(loadingStats).length > 0 
                          ? Math.round(Object.values(loadingStats).reduce((a, b) => a + b, 0) / Object.values(loadingStats).length)
                          : 0}ms
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm font-medium text-green-900 dark:text-green-100">
                        Fast Chunks (&lt;500ms)
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Object.values(loadingStats).filter(time => time < 500).length}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-sm font-medium text-red-900 dark:text-red-100">
                        Slow Chunks (&gt;1s)
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {Object.values(loadingStats).filter(time => time > 1000).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Loading Strategy</h3>
                    <button
                      onClick={optimizeResourceHints}
                      className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                    >
                      Apply Strategy
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {strategy.preload.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Preload ({strategy.preload.length})
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {strategy.preload.map((chunk, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {chunk}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {strategy.prefetch.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Prefetch ({strategy.prefetch.length})
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {strategy.prefetch.map((chunk, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {chunk}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {strategy.defer.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Defer ({strategy.defer.length})
                          </span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {strategy.defer.map((chunk, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {chunk}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {strategy.preload.length === 0 && strategy.prefetch.length === 0 && strategy.defer.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No optimization strategy available</p>
                        <p className="text-sm">Load more chunks to generate recommendations</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Optimization Guide</h3>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Preload
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        Critical resources that will be needed immediately. These are loaded with high priority.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Prefetch
                      </div>
                      <div className="text-green-700 dark:text-green-300">
                        Resources likely to be needed soon. Loaded during idle time with low priority.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Defer
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Non-critical resources that can be loaded after initial page load.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-amber-800 dark:text-amber-200">{suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
                    <div className="text-green-600 dark:text-green-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                      Great Job!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Your bundle is well optimized. No suggestions at this time.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
