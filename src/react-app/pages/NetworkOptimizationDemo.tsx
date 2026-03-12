import React, { useState, useCallback } from 'react'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { 
  useNetworkOptimization, 
  useRequestPrioritization, 
  useAdaptiveLoading 
} from '../hooks/useNetworkOptimization'
import { 
  useBandwidthEstimation
} from '../utils/networkOptimization'
import { Wifi, WifiOff, Activity, Clock, TrendingUp, Zap, Network, Cpu } from 'lucide-react'

const NetworkOptimizationDemo: React.FC = () => {
  const [requestLogs, setRequestLogs] = useState<Array<{
    id: string
    url: string
    method: string
    status: 'pending' | 'success' | 'error'
    duration?: number
    cached?: boolean
    timestamp: Date
  }>>([])

  const [batchRequests, setBatchRequests] = useState<string[]>([])
  const [isRunningBatch, setIsRunningBatch] = useState(false)

  // Network optimization hooks
  const { 
    fetch: optimizedFetchFn, 
    metrics, 
    connectionStatus, 
    smartPrefetch,
    optimizeCache 
  } = useNetworkOptimization()
  
  const { fetch: prioritizedFetch } = useRequestPrioritization()
  const { deviceCapabilities, adaptiveDataFetch } = useAdaptiveLoading()
  const bandwidthInfo = useBandwidthEstimation()

  // Add request to log
  const logRequest = useCallback((
    url: string, 
    method: string, 
    status: 'pending' | 'success' | 'error',
    duration?: number,
    cached?: boolean
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setRequestLogs(prev => [{
      id,
      url,
      method,
      status,
      duration,
      cached,
      timestamp: new Date()
    }, ...prev.slice(0, 19)]) // Keep last 20 requests
  }, [])

  // Test standard fetch
  const testStandardFetch = useCallback(async () => {
    const url = '/api/suppliers'
    logRequest(url, 'GET', 'pending')
    
    const startTime = performance.now()
    try {
      const response = await fetch(url)
      const duration = performance.now() - startTime
      
      if (response.ok) {
        logRequest(url, 'GET', 'success', duration, false)
      } else {
        logRequest(url, 'GET', 'error', duration, false)
      }
    } catch (error) {
      logRequest(url, 'GET', 'error', performance.now() - startTime, false)
    }
  }, [logRequest])

  // Test optimized fetch
  const testOptimizedFetch = useCallback(async () => {
    const url = '/api/suppliers'
    logRequest(url, 'GET (Optimized)', 'pending')
    
    const startTime = performance.now()
    try {
      const response = await optimizedFetchFn(url, { cacheMaxAge: 60000 })
      const duration = performance.now() - startTime
      
      if (response.ok) {
        logRequest(url, 'GET (Optimized)', 'success', duration, duration < 10)
      } else {
        logRequest(url, 'GET (Optimized)', 'error', duration, false)
      }
    } catch (error) {
      logRequest(url, 'GET (Optimized)', 'error', performance.now() - startTime, false)
    }
  }, [optimizedFetchFn, logRequest])

  // Test batch requests
  const testBatchRequests = useCallback(async () => {
    setIsRunningBatch(true)
    const urls = [
      '/api/suppliers',
      '/api/regulations',
      '/api/iot-skus',
      '/api/laboratories'
    ]

    setBatchRequests(urls)

    for (const url of urls) {
      logRequest(url, 'GET (Batch)', 'pending')
    }

    const startTime = performance.now()
    try {
      const results = await adaptiveDataFetch(urls)
      const duration = performance.now() - startTime

      results.forEach((response, index) => {
        const url = urls[index]
        if (response.ok) {
          logRequest(url, 'GET (Batch)', 'success', duration / urls.length, false)
        } else {
          logRequest(url, 'GET (Batch)', 'error', duration / urls.length, false)
        }
      })
    } catch (error) {
      urls.forEach(url => {
        logRequest(url, 'GET (Batch)', 'error', 0, false)
      })
    } finally {
      setIsRunningBatch(false)
      setBatchRequests([])
    }
  }, [adaptiveDataFetch, logRequest])

  // Test prioritized requests
  const testPrioritizedRequests = useCallback(async () => {
    const requests = [
      { url: '/api/suppliers', priority: 'high' as const },
      { url: '/api/regulations', priority: 'medium' as const },
      { url: '/api/laboratories', priority: 'low' as const }
    ]

    for (const req of requests) {
      logRequest(req.url, `GET (${req.priority})`, 'pending')
      
      const startTime = performance.now()
      try {
        const response = await prioritizedFetch(req.url, {}, req.priority)
        const duration = performance.now() - startTime
        
        if (response.ok) {
          logRequest(req.url, `GET (${req.priority})`, 'success', duration, false)
        } else {
          logRequest(req.url, `GET (${req.priority})`, 'error', duration, false)
        }
      } catch (error) {
        logRequest(req.url, `GET (${req.priority})`, 'error', performance.now() - startTime, false)
      }
    }
  }, [prioritizedFetch, logRequest])

  // Smart prefetch demo
  const testSmartPrefetch = useCallback(() => {
    const urlsToPrefetch = [
      '/api/suppliers',
      '/api/regulations',
      '/api/iot-skus'
    ]
    
    smartPrefetch(urlsToPrefetch)
    
    urlsToPrefetch.forEach(url => {
      logRequest(url, 'PREFETCH', 'success', 0, false)
    })
  }, [smartPrefetch, logRequest])

  // Connection quality indicator
  const getConnectionQualityColor = () => {
    if (!connectionStatus.online) return 'red'
    switch (connectionStatus.effectiveType) {
      case '4g': return 'green'
      case '3g': return 'yellow'
      case '2g': 
      case 'slow-2g': return 'red'
      default: return 'gray'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Network className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Optimization Demo</h1>
          <p className="text-gray-600">Advanced networking features and performance monitoring</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
              <div className="flex items-center space-x-2 mt-2">
                {connectionStatus.online ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  {connectionStatus.online ? 'Online' : 'Offline'}
                </span>
                <Badge 
                  variant="secondary"
                  className={`border-2 ${
                    getConnectionQualityColor() === 'green' ? 'border-green-500 text-green-700' :
                    getConnectionQualityColor() === 'yellow' ? 'border-yellow-500 text-yellow-700' :
                    getConnectionQualityColor() === 'red' ? 'border-red-500 text-red-700' :
                    'border-gray-500 text-gray-700'
                  }`}
                >
                  {connectionStatus.effectiveType?.toUpperCase() || 'Unknown'}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div>RTT: {connectionStatus.rtt}ms</div>
                <div>Downlink: {connectionStatus.downlink} Mbps</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bandwidth Quality</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <Badge variant="secondary">
                  {bandwidthInfo.quality.toUpperCase()}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div>Download: {bandwidthInfo.downloadSpeed.toFixed(2)} Mbps</div>
                <div>Ping: {bandwidthInfo.ping}ms</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Device Capabilities</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Cpu className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600">
                  {deviceCapabilities.cores} cores
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div>Memory: {deviceCapabilities.memory}GB</div>
                <div>Connection: {deviceCapabilities.connectionType}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.requestCount}</div>
            <div className="text-sm text-gray-500">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.cacheHitRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Cache Hit Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.averageResponseTime.toFixed(0)}ms</div>
            <div className="text-sm text-gray-500">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.failureRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Failure Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.bandwidthUsage}</div>
            <div className="text-sm text-gray-500">Cache Entries</div>
          </div>
        </div>
      </Card>

      {/* Test Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button onClick={testStandardFetch} variant="secondary">
            Standard Fetch
          </Button>
          <Button onClick={testOptimizedFetch} variant="secondary">
            <Zap className="w-4 h-4 mr-2" />
            Optimized Fetch
          </Button>
          <Button onClick={testSmartPrefetch} variant="secondary">
            Smart Prefetch
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={testBatchRequests} 
            disabled={isRunningBatch}
            variant="secondary"
          >
            {isRunningBatch ? 'Running...' : 'Batch Requests'}
          </Button>
          <Button onClick={testPrioritizedRequests} variant="secondary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Priority Requests
          </Button>
          <Button onClick={optimizeCache} variant="secondary">
            Optimize Cache
          </Button>
        </div>
      </Card>

      {/* Request Log */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Log</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {requestLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No requests yet. Try running some tests above.
            </div>
          ) : (
            requestLogs.map((log) => (
              <div 
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={log.status === 'success' ? 'success' : 
                            log.status === 'error' ? 'error' : 'secondary'}
                  >
                    {log.method}
                  </Badge>
                  <span className="text-sm font-mono text-gray-700">{log.url}</span>
                  {log.cached && (
                    <Badge variant="info" className="text-xs">
                      CACHED
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {log.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{log.duration.toFixed(0)}ms</span>
                    </div>
                  )}
                  <span>{log.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Batch Progress */}
      {batchRequests.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Progress</h3>
          <div className="space-y-2">
            {batchRequests.map((url, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{url}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default NetworkOptimizationDemo
