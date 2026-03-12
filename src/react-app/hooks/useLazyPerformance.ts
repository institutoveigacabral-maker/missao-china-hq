import { useEffect, useState, useCallback } from 'react'

interface LazyLoadMetrics {
  componentName: string
  loadTime: number
  chunkSize?: number
  cacheHit: boolean
  timestamp: number
}

interface PerformanceStats {
  totalComponents: number
  avgLoadTime: number
  cacheHitRate: number
  slowestComponent: LazyLoadMetrics | null
  fastestComponent: LazyLoadMetrics | null
  recentLoads: LazyLoadMetrics[]
}

// Global metrics collection
const lazyLoadMetrics: LazyLoadMetrics[] = []
const MAX_METRICS = 100

export const useLazyPerformance = () => {
  const [metrics, setMetrics] = useState<LazyLoadMetrics[]>([])
  const [isTracking, setIsTracking] = useState(process.env.NODE_ENV === 'development')

  const recordLoadTime = useCallback((componentName: string, loadTime: number, options?: {
    chunkSize?: number
    cacheHit?: boolean
  }) => {
    if (!isTracking) return

    const metric: LazyLoadMetrics = {
      componentName,
      loadTime,
      chunkSize: options?.chunkSize,
      cacheHit: options?.cacheHit || false,
      timestamp: Date.now()
    }

    lazyLoadMetrics.push(metric)
    
    // Keep only the most recent metrics
    if (lazyLoadMetrics.length > MAX_METRICS) {
      lazyLoadMetrics.shift()
    }

    setMetrics([...lazyLoadMetrics])

    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Lazy Load: ${componentName} - ${loadTime.toFixed(2)}ms`, metric)
    }
  }, [isTracking])

  const getPerformanceStats = useCallback((): PerformanceStats => {
    if (metrics.length === 0) {
      return {
        totalComponents: 0,
        avgLoadTime: 0,
        cacheHitRate: 0,
        slowestComponent: null,
        fastestComponent: null,
        recentLoads: []
      }
    }

    const loadTimes = metrics.map(m => m.loadTime)
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
    const cacheHits = metrics.filter(m => m.cacheHit).length
    const cacheHitRate = (cacheHits / metrics.length) * 100

    const slowestComponent = metrics.reduce((slowest, current) => 
      !slowest || current.loadTime > slowest.loadTime ? current : slowest
    )

    const fastestComponent = metrics.reduce((fastest, current) => 
      !fastest || current.loadTime < fastest.loadTime ? current : fastest
    )

    return {
      totalComponents: metrics.length,
      avgLoadTime,
      cacheHitRate,
      slowestComponent,
      fastestComponent,
      recentLoads: metrics.slice(-10) // Last 10 loads
    }
  }, [metrics])

  const clearMetrics = useCallback(() => {
    lazyLoadMetrics.length = 0
    setMetrics([])
  }, [])

  const toggleTracking = useCallback(() => {
    setIsTracking(prev => !prev)
  }, [])

  // Analyze performance patterns
  const getInsights = useCallback(() => {
    const stats = getPerformanceStats()
    const insights: string[] = []

    if (stats.avgLoadTime > 1000) {
      insights.push('⚠️ Average load time is high (>1s). Consider optimization.')
    }

    if (stats.cacheHitRate < 50) {
      insights.push('💾 Low cache hit rate. Review caching strategy.')
    }

    if (stats.slowestComponent && stats.slowestComponent.loadTime > 2000) {
      insights.push(`🐌 ${stats.slowestComponent.componentName} is very slow (${stats.slowestComponent.loadTime.toFixed(0)}ms)`)
    }

    const recentSlow = stats.recentLoads.filter(load => load.loadTime > 1500)
    if (recentSlow.length > 3) {
      insights.push('📉 Recent performance degradation detected')
    }

    return insights
  }, [getPerformanceStats])

  return {
    metrics,
    isTracking,
    recordLoadTime,
    getPerformanceStats,
    getInsights,
    clearMetrics,
    toggleTracking
  }
}

// Hook for tracking individual component loads
export const useComponentLoadTracking = (componentName: string) => {
  const { recordLoadTime } = useLazyPerformance()

  const trackLoad = useCallback((startTime: number) => {
    const loadTime = performance.now() - startTime
    recordLoadTime(componentName, loadTime)
  }, [componentName, recordLoadTime])

  const withTracking = useCallback(<T extends any[]>(fn: (...args: T) => void) => {
    return (...args: T) => {
      const startTime = performance.now()
      fn(...args)
      trackLoad(startTime)
    }
  }, [trackLoad])

  return { trackLoad, withTracking }
}

// Performance observer for lazy chunks
export const useLazyChunkObserver = () => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.name.includes('chunk') || entry.name.includes('lazy')) {
          console.log('📦 Lazy chunk loaded:', {
            name: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize || 'unknown'
          })
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [])
}

// Preload performance tracking
export const usePreloadTracking = () => {
  const [preloadStats, setPreloadStats] = useState<{
    successful: number
    failed: number
    total: number
  }>({ successful: 0, failed: 0, total: 0 })

  const trackPreload = useCallback((success: boolean) => {
    setPreloadStats(prev => ({
      successful: prev.successful + (success ? 1 : 0),
      failed: prev.failed + (success ? 0 : 1),
      total: prev.total + 1
    }))
  }, [])

  const getPreloadEfficiency = useCallback(() => {
    if (preloadStats.total === 0) return 0
    return (preloadStats.successful / preloadStats.total) * 100
  }, [preloadStats])

  return {
    preloadStats,
    trackPreload,
    getPreloadEfficiency
  }
}
