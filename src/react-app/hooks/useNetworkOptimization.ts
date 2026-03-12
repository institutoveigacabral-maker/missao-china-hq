import { useCallback, useEffect, useRef, useState } from 'react'
import { 
  useOptimizedFetch, 
  useConnectionStatus, 
  useNetworkAwareFetch,
  optimizedFetch,
  prefetchResource
} from '../utils/networkOptimization'

// Advanced network optimization hook
export const useNetworkOptimization = () => {
  const [metrics, setMetrics] = useState({
    requestCount: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
    failureRate: 0,
    bandwidthUsage: 0
  })

  const requestTimes = useRef<number[]>([])
  const totalRequests = useRef(0)
  const failedRequests = useRef(0)
  const cacheHits = useRef(0)

  const { fetch: optimizedFetchFn, getCacheStats } = useOptimizedFetch()
  const connectionStatus = useConnectionStatus()
  const { fetch: networkAwareFetch } = useNetworkAwareFetch()

  // Performance monitoring wrapper
  const monitoredFetch = useCallback(async (
    url: string,
    options: Parameters<typeof optimizedFetchFn>[1] = {}
  ) => {
    const startTime = performance.now()
    totalRequests.current++

    try {
      const response = await networkAwareFetch(url, options)
      const endTime = performance.now()
      const responseTime = endTime - startTime

      // Track response time
      requestTimes.current.push(responseTime)
      if (requestTimes.current.length > 100) {
        requestTimes.current.shift() // Keep only last 100 requests
      }

      // Check if response came from cache
      const wasFromCache = responseTime < 10 // Very fast response likely from cache
      if (wasFromCache) {
        cacheHits.current++
      }

      return response
    } catch (error) {
      failedRequests.current++
      throw error
    }
  }, [networkAwareFetch])

  // Update metrics periodically
  useEffect(() => {
    const updateMetrics = () => {
      const cacheStats = getCacheStats()
      const avgResponseTime = requestTimes.current.length > 0
        ? requestTimes.current.reduce((a, b) => a + b, 0) / requestTimes.current.length
        : 0

      setMetrics({
        requestCount: totalRequests.current,
        cacheHitRate: totalRequests.current > 0 ? (cacheHits.current / totalRequests.current) * 100 : 0,
        averageResponseTime: avgResponseTime,
        failureRate: totalRequests.current > 0 ? (failedRequests.current / totalRequests.current) * 100 : 0,
        bandwidthUsage: cacheStats.size
      })
    }

    const interval = setInterval(updateMetrics, 1000)
    return () => clearInterval(interval)
  }, [getCacheStats])

  // Smart prefetching based on user behavior
  const smartPrefetch = useCallback((urls: string[]) => {
    if (!connectionStatus.online) return

    // Prefetch based on connection quality
    const maxPrefetch = connectionStatus.effectiveType === '4g' ? urls.length : 
                       connectionStatus.effectiveType === '3g' ? Math.min(3, urls.length) : 1

    urls.slice(0, maxPrefetch).forEach(url => {
      prefetchResource(url, connectionStatus.effectiveType === '4g' ? 'high' : 'low')
    })
  }, [connectionStatus])

  // Auto-optimize cache based on usage patterns
  const optimizeCache = useCallback(() => {
    const stats = getCacheStats()
    
    // Clear old cache entries if cache is getting large
    if (stats.size > 50) {
      optimizedFetch.clearCache()
    }
  }, [getCacheStats])

  return {
    fetch: monitoredFetch,
    metrics,
    connectionStatus,
    smartPrefetch,
    optimizeCache,
    prefetchResource
  }
}

// Hook for request prioritization
export const useRequestPrioritization = () => {
  const priorityQueue = useRef<Array<{
    url: string
    options: RequestInit
    priority: 'high' | 'medium' | 'low'
    resolve: (value: Response) => void
    reject: (error: Error) => void
  }>>([])

  const processing = useRef(false)

  const processQueue = useCallback(async () => {
    if (processing.current || priorityQueue.current.length === 0) return

    processing.current = true

    // Sort by priority
    priorityQueue.current.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 }
      return priorities[b.priority] - priorities[a.priority]
    })

    // Process high priority requests first
    const batch = priorityQueue.current.splice(0, 3) // Process 3 at a time

    await Promise.allSettled(
      batch.map(async request => {
        try {
          const response = await fetch(request.url, request.options)
          request.resolve(response)
        } catch (error) {
          request.reject(error as Error)
        }
      })
    )

    processing.current = false

    // Continue processing if more requests exist
    if (priorityQueue.current.length > 0) {
      setTimeout(processQueue, 10)
    }
  }, [])

  const prioritizedFetch = useCallback((
    url: string,
    options: RequestInit = {},
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      priorityQueue.current.push({
        url,
        options,
        priority,
        resolve,
        reject
      })

      processQueue()
    })
  }, [processQueue])

  return { fetch: prioritizedFetch }
}

// Hook for adaptive loading based on device capabilities
export const useAdaptiveLoading = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    memory: (navigator as any).deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    connectionType: (navigator as any).connection?.effectiveType || '4g'
  })

  const getOptimalChunkSize = useCallback(() => {
    const { memory, cores, connectionType } = deviceCapabilities

    // Adjust chunk size based on device capabilities
    if (connectionType === '4g' && memory >= 8 && cores >= 8) {
      return 50 // High-end device
    } else if (connectionType === '3g' || memory <= 2) {
      return 10 // Low-end device
    } else {
      return 25 // Medium device
    }
  }, [deviceCapabilities])

  const adaptiveDataFetch = useCallback(async (
    urls: string[],
    options: RequestInit = {}
  ) => {
    const chunkSize = getOptimalChunkSize()
    const results: Response[] = []

    // Process URLs in chunks based on device capabilities
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize)
      
      const chunkResults = await Promise.allSettled(
        chunk.map(url => fetch(url, options))
      )

      chunkResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        }
      })

      // Add delay for low-end devices
      if (deviceCapabilities.memory <= 2) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }, [getOptimalChunkSize, deviceCapabilities])

  useEffect(() => {
    const updateCapabilities = () => {
      setDeviceCapabilities({
        memory: (navigator as any).deviceMemory || 4,
        cores: navigator.hardwareConcurrency || 4,
        connectionType: (navigator as any).connection?.effectiveType || '4g'
      })
    }

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateCapabilities)
      return () => connection.removeEventListener('change', updateCapabilities)
    }
  }, [])

  return {
    deviceCapabilities,
    getOptimalChunkSize,
    adaptiveDataFetch
  }
}
