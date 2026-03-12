import { useEffect, useState } from 'react';
import { performanceMonitor, PerformanceMetrics } from '../utils/performanceMonitor';

export interface UsePerformanceReturn {
  metrics: Partial<PerformanceMetrics>;
  isLoading: boolean;
  refresh: () => void;
}

export function usePerformance(): UsePerformanceReturn {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = () => {
    const currentMetrics = performanceMonitor.getMetrics();
    setMetrics(currentMetrics);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial load
    const timer = setTimeout(refresh, 1000);

    // Periodic updates
    const interval = setInterval(refresh, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return {
    metrics,
    isLoading,
    refresh,
  };
}

// Hook for component-level performance tracking
export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development' && renderTime > 100) {
        console.warn(`⚠️ Component "${componentName}" took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  });
}

// Hook for measuring custom timing
export function useCustomTiming(label: string) {
  const [timing, setTiming] = useState<number | null>(null);

  const start = () => {
    performance.mark(`${label}-start`);
  };

  const end = () => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    setTiming(measure.duration);
    
    return measure.duration;
  };

  return { timing, start, end };
}
