import { useState, useEffect } from 'react';
import { bundleOptimizer, BundleMetrics, ChunkAnalysis, LoadingStrategy } from '../utils/bundleOptimizer';

export interface BundleAnalysisData {
  metrics: BundleMetrics;
  chunks: ChunkAnalysis[];
  loadingStats: Record<string, number>;
  strategy: LoadingStrategy;
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

export function useBundleMetrics(autoRefresh = true, interval = 10000) {
  const [data, setData] = useState<BundleAnalysisData>({
    metrics: {
      totalSize: 0,
      totalGzipSize: 0,
      chunkCount: 0,
      vendorSize: 0,
      applicationSize: 0,
      lazyChunks: 0,
      duplicateModules: [],
      largeDependencies: [],
    },
    chunks: [],
    loadingStats: {},
    strategy: { preload: [], prefetch: [], defer: [] },
    suggestions: [],
    isLoading: true,
    error: null,
  });

  const refreshData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const chunks = bundleOptimizer.analyzeBundles();
      const metrics = bundleOptimizer.getBundleMetrics();
      const loadingStats = bundleOptimizer.getLoadingStats();
      const strategy = bundleOptimizer.generateLoadingStrategy();
      const suggestions = bundleOptimizer.getOptimizationSuggestions();

      setData({
        metrics,
        chunks,
        loadingStats,
        strategy,
        suggestions,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to analyze bundle',
      }));
    }
  };

  const optimizeResourceHints = () => {
    bundleOptimizer.optimizeResourceHints();
  };

  const trackChunkUsage = (chunkName: string) => {
    bundleOptimizer.trackChunkUsage(chunkName);
  };

  const resetAnalysis = () => {
    bundleOptimizer.reset();
    refreshData();
  };

  useEffect(() => {
    // Initial load
    refreshData();

    // Auto refresh
    if (autoRefresh && interval > 0) {
      const timer = setInterval(refreshData, interval);
      return () => clearInterval(timer);
    }
  }, [autoRefresh, interval]);

  // Monitor route changes for chunk tracking
  useEffect(() => {
    const handleRouteChange = () => {
      setTimeout(() => {
        refreshData();
      }, 1000); // Give time for chunks to load
    };

    // Listen for route changes (React Router)
    window.addEventListener('popstate', handleRouteChange);
    
    // Custom event for programmatic navigation
    window.addEventListener('bundle:route-change', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('bundle:route-change', handleRouteChange);
    };
  }, []);

  return {
    ...data,
    refreshData,
    optimizeResourceHints,
    trackChunkUsage,
    resetAnalysis,
  };
}
