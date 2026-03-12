// Network Optimization Utilities - Enhanced with better memory management
import { useCallback, useState, useEffect, useRef } from 'react'
import { useToast } from '../hooks/useToast'

// Request batching system with automatic cleanup
class RequestBatcher {
  private batches = new Map<string, {
    requests: Array<{
      url: string
      options: RequestInit
      resolve: (value: Response) => void
      reject: (error: Error) => void
    }>
    timeout: number
  }>()
  
  private batchDelay = 50 // 50ms batching window
  private maxBatchSize = 10 // Maximum requests per batch

  batch(url: string, options: RequestInit = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
      const batchKey = this.getBatchKey(url, options)
      
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, {
          requests: [],
          timeout: window.setTimeout(() => this.executeBatch(batchKey), this.batchDelay)
        })
      }
      
      const batch = this.batches.get(batchKey)!
      batch.requests.push({ url, options, resolve, reject })

      // Execute immediately if batch is full
      if (batch.requests.length >= this.maxBatchSize) {
        clearTimeout(batch.timeout)
        this.executeBatch(batchKey)
      }
    })
  }

  private getBatchKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET'
    const baseUrl = url.split('?')[0]
    return `${method}:${baseUrl}`
  }

  private async executeBatch(batchKey: string) {
    const batch = this.batches.get(batchKey)
    if (!batch) return

    this.batches.delete(batchKey)

    // For GET requests, try to batch multiple queries
    if (batch.requests.every(req => !req.options.method || req.options.method === 'GET')) {
      await this.executeBatchedGets(batch.requests)
    } else {
      // Execute individual requests for non-GET
      for (const request of batch.requests) {
        try {
          const response = await fetch(request.url, request.options)
          request.resolve(response)
        } catch (error) {
          request.reject(error as Error)
        }
      }
    }
  }

  private async executeBatchedGets(requests: Array<{
    url: string
    options: RequestInit
    resolve: (value: Response) => void
    reject: (error: Error) => void
  }>) {
    // Create batch request
    const batchPayload = {
      requests: requests.map(req => ({
        url: req.url,
        headers: req.options.headers
      }))
    }

    try {
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchPayload)
      })

      if (!response.ok) {
        throw new Error(`Batch request failed: ${response.statusText}`)
      }

      const results = await response.json()

      // Resolve individual requests
      requests.forEach((request, index) => {
        const result = results[index]
        if (result?.error) {
          request.reject(new Error(result.error))
        } else {
          // Create mock response
          const mockResponse = new Response(
            JSON.stringify(result?.data || result), 
            {
              status: result?.status || 200,
              statusText: result?.statusText || 'OK',
              headers: new Headers(result?.headers || {})
            }
          )
          request.resolve(mockResponse)
        }
      })
    } catch (error) {
      // Fallback to individual requests
      for (const request of requests) {
        try {
          const response = await fetch(request.url, request.options)
          request.resolve(response)
        } catch (err) {
          request.reject(err as Error)
        }
      }
    }
  }

  // Cleanup method
  destroy() {
    for (const [, batch] of this.batches) {
      clearTimeout(batch.timeout)
      batch.requests.forEach(req => 
        req.reject(new Error('RequestBatcher destroyed'))
      )
    }
    this.batches.clear()
  }
}

// Enhanced fetch with caching and optimization
class OptimizedFetch {
  private cache = new Map<string, {
    data: any
    timestamp: number
    maxAge: number
  }>()
  
  private pendingRequests = new Map<string, Promise<any>>()
  private maxCacheSize = 500
  private cleanupInterval: number | null = null

  constructor() {
    this.startCleanupTimer()
  }

  private startCleanupTimer() {
    if (typeof window === 'undefined') return

    this.cleanupInterval = window.setInterval(() => {
      this.cleanExpiredCache()
      this.enforceCacheLimit()
    }, 60000) // Cleanup every minute
  }

  private cleanExpiredCache() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.maxAge) {
        this.cache.delete(key)
      }
    }
  }

  private enforceCacheLimit() {
    if (this.cache.size <= this.maxCacheSize) return

    // Remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
    
    const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize)
    toRemove.forEach(([cacheKey]) => this.cache.delete(cacheKey))
  }

  async fetch(
    url: string, 
    options: RequestInit & {
      cacheMaxAge?: number
      retries?: number
      timeout?: number
      batch?: boolean
    } = {}
  ): Promise<Response> {
    const {
      cacheMaxAge = 5 * 60 * 1000, // 5 minutes default
      retries = 3,
      timeout = 10000,
      batch = false,
      ...fetchOptions
    } = options

    const cacheKey = this.getCacheKey(url, fetchOptions)

    // Check cache first for GET requests
    if ((!fetchOptions.method || fetchOptions.method === 'GET') && this.shouldUseCache(cacheKey, cacheMaxAge)) {
      const cached = this.cache.get(cacheKey)!
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check pending requests to avoid duplicates
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!
    }

    // Create request promise
    const requestPromise = this.executeRequest(url, fetchOptions, { retries, timeout, batch })
      .finally(() => {
        this.pendingRequests.delete(cacheKey)
      })
    
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const response = await requestPromise
      
      // Cache successful GET responses
      if (response.ok && (!fetchOptions.method || fetchOptions.method === 'GET')) {
        try {
          const data = await response.clone().json()
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            maxAge: cacheMaxAge
          })
        } catch {
          // Ignore JSON parse errors for caching
        }
      }

      return response
    } catch (error) {
      throw error
    }
  }

  private async executeRequest(
    url: string,
    options: RequestInit,
    config: { retries: number; timeout: number; batch: boolean }
  ): Promise<Response> {
    const { retries, timeout, batch } = config

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const requestOptions = {
          ...options,
          signal: controller.signal
        }

        let response: Response
        if (batch && (!options.method || options.method === 'GET')) {
          response = await requestBatcher.batch(url, requestOptions)
        } else {
          response = await fetch(url, requestOptions)
        }

        clearTimeout(timeoutId)

        if (response.ok) {
          return response
        }

        // Don't retry client errors (4xx) except 429
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return response
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)

      } catch (error) {
        if (attempt === retries) {
          throw error
        }

        // Don't retry on abort
        if (error instanceof Error && error.name === 'AbortError') {
          throw error
        }

        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(2, attempt), 5000)
        const jitter = Math.random() * 1000
        const delay = baseDelay + jitter
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('Max retries exceeded')
  }

  private getCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET'
    const body = options.body ? JSON.stringify(options.body) : ''
    const headers = options.headers ? JSON.stringify(options.headers) : ''
    return `${method}:${url}:${body}:${headers}`
  }

  private shouldUseCache(cacheKey: string, maxAge: number): boolean {
    const cached = this.cache.get(cacheKey)
    if (!cached) return false
    
    return Date.now() - cached.timestamp < maxAge
  }

  clearCache(pattern?: string) {
    if (pattern) {
      for (const [cacheKey] of this.cache) {
        if (cacheKey.includes(pattern)) {
          this.cache.delete(cacheKey)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  getCacheStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.values())
    
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      validEntries: entries.filter(entry => now - entry.timestamp < entry.maxAge).length,
      expiredEntries: entries.filter(entry => now - entry.timestamp >= entry.maxAge).length,
      pendingRequests: this.pendingRequests.size
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
    this.pendingRequests.clear()
  }
}

// Global instances
const requestBatcher = new RequestBatcher()
export const optimizedFetch = new OptimizedFetch()

// React hook for optimized API calls
export const useOptimizedFetch = () => {
  const toast = useToast()

  const fetchWithErrorHandling = useCallback(async (
    url: string,
    options?: Parameters<typeof optimizedFetch.fetch>[1]
  ) => {
    try {
      const response = await optimizedFetch.fetch(url, options)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }
      
      return response
    } catch (error) {
      console.error('Fetch error:', error)
      if (toast) {
        toast.error(`Erro na requisição: ${(error as Error).message}`)
      }
      throw error
    }
  }, [toast])

  return {
    fetch: fetchWithErrorHandling,
    clearCache: optimizedFetch.clearCache.bind(optimizedFetch),
    getCacheStats: optimizedFetch.getCacheStats.bind(optimizedFetch)
  }
}

// Prefetch utility for critical resources
export const prefetchResource = (url: string, priority: 'high' | 'low' = 'low') => {
  if (typeof window === 'undefined') return

  // Use link prefetch
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = 'fetch'
  
  if (priority === 'high') {
    link.setAttribute('importance', 'high')
  }
  
  document.head.appendChild(link)

  // Also prefetch via fetch API
  setTimeout(() => {
    fetch(url, { method: 'HEAD' }).catch(() => {
      // Ignore prefetch errors
    })
  }, 100)

  // Return cleanup function
  return () => {
    if (link.parentNode) {
      link.parentNode.removeChild(link)
    }
  }
}

// Enhanced connection monitoring
export const useConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: (typeof navigator !== 'undefined' && (navigator as any).connection?.effectiveType) || 'unknown',
    downlink: (typeof navigator !== 'undefined' && (navigator as any).connection?.downlink) || 0,
    rtt: (typeof navigator !== 'undefined' && (navigator as any).connection?.rtt) || 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateOnlineStatus = () => {
      setConnectionStatus(prev => ({
        ...prev,
        online: navigator.onLine
      }))
    }

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection
      if (connection) {
        setConnectionStatus(prev => ({
          ...prev,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }))
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return connectionStatus
}

// Network-aware data fetching
export const useNetworkAwareFetch = () => {
  const { online, effectiveType } = useConnectionStatus()
  const { fetch } = useOptimizedFetch()

  const networkAwareFetch = useCallback((
    url: string,
    options: Parameters<typeof optimizedFetch.fetch>[1] = {}
  ) => {
    // Adjust options based on connection
    const adaptedOptions = { ...options }

    if (!online) {
      // Use cached data only when offline
      adaptedOptions.cacheMaxAge = Infinity
    } else if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Aggressive caching for slow connections
      adaptedOptions.cacheMaxAge = 30 * 60 * 1000 // 30 minutes
      adaptedOptions.timeout = 30000 // 30 seconds
      adaptedOptions.retries = 1 // Fewer retries on slow connection
    } else if (effectiveType === '3g') {
      // Moderate caching for 3G
      adaptedOptions.cacheMaxAge = 10 * 60 * 1000 // 10 minutes
      adaptedOptions.timeout = 15000 // 15 seconds
    }

    return fetch(url, adaptedOptions)
  }, [online, effectiveType, fetch])

  return {
    fetch: networkAwareFetch,
    connectionStatus: { online, effectiveType }
  }
}

// Request deduplication hook with cleanup
export const useRequestDeduplication = () => {
  const pendingRef = useRef(new Map<string, Promise<any>>())

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      pendingRef.current.clear()
    }
  }, [])

  const deduplicatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    const key = JSON.stringify({ url, options })
    
    if (pendingRef.current.has(key)) {
      return pendingRef.current.get(key)!
    }

    const promise = fetch(url, options)
      .finally(() => {
        pendingRef.current.delete(key)
      })
    
    pendingRef.current.set(key, promise)
    return promise
  }, [])

  return { fetch: deduplicatedFetch }
}

// Enhanced bandwidth estimation
export const useBandwidthEstimation = () => {
  const [bandwidth, setBandwidth] = useState<{
    downloadSpeed: number // Mbps
    uploadSpeed: number // Mbps
    ping: number // ms
    quality: 'poor' | 'fair' | 'good' | 'excellent'
    lastMeasured: number
  }>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    quality: 'fair',
    lastMeasured: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const estimateBandwidth = async () => {
      try {
        const startTime = performance.now()
        
        // Create a small test payload
        const testData = 'x'.repeat(1024) // 1KB test
        
        const response = await fetch('/api/ping', { 
          method: 'POST',
          body: testData,
          cache: 'no-store',
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        
        if (!response.ok) {
          throw new Error('Bandwidth test failed')
        }
        
        const data = await response.text()
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000 // seconds
        const sizeBytes = new Blob([data]).size
        const speedMbps = (sizeBytes * 8) / (duration * 1000000)

        const connection = (navigator as any).connection
        const ping = connection?.rtt || Math.round(endTime - startTime)

        let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair'
        if (speedMbps > 10) quality = 'excellent'
        else if (speedMbps > 5) quality = 'good'
        else if (speedMbps > 1) quality = 'fair'
        else quality = 'poor'

        setBandwidth({
          downloadSpeed: Math.max(speedMbps, 0.1),
          uploadSpeed: Math.max(speedMbps * 0.5, 0.1), // Estimate upload as 50% of download
          ping,
          quality,
          lastMeasured: Date.now()
        })
      } catch (error) {
        console.warn('Bandwidth estimation failed:', error)
        // Set conservative defaults on error
        setBandwidth(prev => ({
          ...prev,
          quality: 'fair',
          lastMeasured: Date.now()
        }))
      }
    }

    // Initial measurement
    estimateBandwidth()
    
    // Re-measure every 5 minutes
    const interval = setInterval(estimateBandwidth, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return bandwidth
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    requestBatcher.destroy()
    optimizedFetch.destroy()
  })
}
