import React, { useEffect, useState } from 'react'
import { useLazyPerformance, useLazyChunkObserver, usePreloadTracking } from '@/react-app/hooks/useLazyPerformance'
import { Spinner } from './ui/Spinner'

// Component for monitoring and optimizing lazy loading performance
export const LazyOptimizationMonitor: React.FC = () => {
  const { getPerformanceStats, getInsights, isTracking, toggleTracking, clearMetrics } = useLazyPerformance()
  const { getPreloadEfficiency } = usePreloadTracking()
  const [showDetails, setShowDetails] = useState(false)

  useLazyChunkObserver()

  const stats = getPerformanceStats()
  const insights = getInsights()

  if (process.env.NODE_ENV !== 'development' || !isTracking) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">⚡ Lazy Load Monitor</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-white/80 hover:text-white text-xs"
          >
            {showDetails ? '−' : '+'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <span className="text-purple-200">Components:</span>
            <span className="ml-1 font-medium">{stats.totalComponents}</span>
          </div>
          <div>
            <span className="text-purple-200">Avg Load:</span>
            <span className="ml-1 font-medium">{stats.avgLoadTime.toFixed(0)}ms</span>
          </div>
          <div>
            <span className="text-purple-200">Cache Hit:</span>
            <span className="ml-1 font-medium">{stats.cacheHitRate.toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-purple-200">Preloads:</span>
            <span className="ml-1 font-medium">{getPreloadEfficiency().toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="p-3 max-h-64 overflow-y-auto">
          {/* Performance Insights */}
          {insights.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-xs text-gray-700 mb-2">📊 Insights</h4>
              <div className="space-y-1">
                {insights.map((insight, i) => (
                  <div key={i} className="text-xs text-gray-600 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Loads */}
          <div className="mb-3">
            <h4 className="font-medium text-xs text-gray-700 mb-2">🔄 Recent Loads</h4>
            <div className="space-y-1">
              {stats.recentLoads.slice(-5).map((load, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {load.componentName.split('/').pop()}
                  </span>
                  <span className={`font-mono ${load.loadTime > 1000 ? 'text-red-600' : load.loadTime > 500 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {load.loadTime.toFixed(0)}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Slowest/Fastest */}
          {stats.slowestComponent && stats.fastestComponent && (
            <div className="mb-3">
              <h4 className="font-medium text-xs text-gray-700 mb-2">🏁 Extremes</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-600">🐌 Slowest:</span>
                  <span className="font-mono">{stats.slowestComponent.loadTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">🚀 Fastest:</span>
                  <span className="font-mono">{stats.fastestComponent.loadTime.toFixed(0)}ms</span>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={clearMetrics}
              className="flex-1 bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={toggleTracking}
              className="flex-1 bg-purple-100 text-purple-700 text-xs py-1 px-2 rounded hover:bg-purple-200"
            >
              {isTracking ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced lazy wrapper with performance tracking
export const LazyComponentWrapper: React.FC<{
  name: string
  children: React.ReactNode
  fallback?: React.ComponentType
}> = ({ name, children, fallback: Fallback = () => <Spinner size="md" /> }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { recordLoadTime } = useLazyPerformance()

  useEffect(() => {
    const startTime = performance.now()
    
    const timer = setTimeout(() => {
      setIsLoading(false)
      const loadTime = performance.now() - startTime
      recordLoadTime(name, loadTime)
    }, 0)

    return () => clearTimeout(timer)
  }, [name, recordLoadTime])

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">❌ Error loading {name}</div>
        <button
          onClick={() => {
            setError(null)
            setIsLoading(true)
          }}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Fallback />
        {process.env.NODE_ENV === 'development' && (
          <span className="ml-2 text-xs text-gray-500">Loading {name}...</span>
        )}
      </div>
    )
  }

  return <>{children}</>
}

// Smart preloader component
export const SmartPreloader: React.FC<{
  routes: Array<() => Promise<any>>
  delay?: number
}> = ({ routes, delay = 3000 }) => {
  const [preloadStatus, setPreloadStatus] = useState<{
    completed: number
    total: number
    current: string | null
  }>({ completed: 0, total: routes.length, current: null })

  const { trackPreload } = usePreloadTracking()

  useEffect(() => {
    // Check if user has fast connection
    const connection = (navigator as any).connection
    const isFastConnection = !connection || connection.effectiveType === '4g'
    
    if (!isFastConnection) {
      console.log('🔄 Slow connection detected, skipping preload')
      return
    }

    const startPreloading = async () => {
      await new Promise(resolve => setTimeout(resolve, delay))

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        const routeName = route.toString().match(/import\("(.+?)"\)/)?.[1] || `Route ${i + 1}`
        
        setPreloadStatus(prev => ({ ...prev, current: routeName }))

        try {
          await route()
          trackPreload(true)
          setPreloadStatus(prev => ({ ...prev, completed: prev.completed + 1 }))
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Preloaded: ${routeName}`)
          }
        } catch (error) {
          trackPreload(false)
          if (process.env.NODE_ENV === 'development') {
            console.warn(`❌ Failed to preload: ${routeName}`, error)
          }
        }

        // Small delay between preloads to not overwhelm
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      setPreloadStatus(prev => ({ ...prev, current: null }))
    }

    startPreloading()
  }, [routes, delay, trackPreload])

  if (process.env.NODE_ENV !== 'development' || !preloadStatus.current) {
    return null
  }

  const progress = (preloadStatus.completed / preloadStatus.total) * 100

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <div className="text-sm">
          <div className="font-medium">
            Preloading... {preloadStatus.completed}/{preloadStatus.total}
          </div>
          <div className="text-xs opacity-80">
            {preloadStatus.current}
          </div>
        </div>
      </div>
      <div className="mt-2 w-48 h-1 bg-blue-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Critical resource preloader
export const CriticalResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical resources that lazy components might need
    const preloadResources = [
      // Fonts
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      // Icons (if using external)
      // Images that appear frequently
    ]

    preloadResources.forEach(href => {
      if (href.includes('.css')) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = href
        document.head.appendChild(link)
      } else if (href.includes('.js')) {
        const link = document.createElement('link')
        link.rel = 'modulepreload'
        link.href = href
        document.head.appendChild(link)
      }
    })
  }, [])

  return null
}

// Adaptive loading based on user behavior
export const AdaptiveLazyLoader: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [userPattern, setUserPattern] = useState<{
    fastClicker: boolean
    frequentNavigator: boolean
    preference: 'performance' | 'data-saving' | 'balanced'
  }>({
    fastClicker: false,
    frequentNavigator: false,
    preference: 'balanced'
  })

  useEffect(() => {
    // Analyze user behavior
    let clickCount = 0
    let navCount = 0
    const startTime = Date.now()

    const handleClick = () => {
      clickCount++
      if (Date.now() - startTime < 10000 && clickCount > 10) {
        setUserPattern(prev => ({ ...prev, fastClicker: true, preference: 'performance' }))
      }
    }

    const handleNavigation = () => {
      navCount++
      if (navCount > 5) {
        setUserPattern(prev => ({ ...prev, frequentNavigator: true }))
      }
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('popstate', handleNavigation)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])

  // Provide user pattern context to child components
  return (
    <div data-user-pattern={userPattern.preference}>
      {children}
    </div>
  )
}
