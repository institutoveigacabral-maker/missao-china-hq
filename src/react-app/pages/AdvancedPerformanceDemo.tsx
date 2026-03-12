import React, { useState, useRef, useCallback } from 'react'
import { 
  useDebouncedCallback, 
  useThrottledCallback,
  useAsyncMemo,
  useDeepMemo,
  useRenderCount,
  useWhyDidYouUpdate,
  useVirtualScrolling,
  useIntersectionObserver,
  usePerformanceMeasurement,
  useMemoryMonitoring,
  useLifecycleTracking,
  useExpensiveComputation
} from '@/react-app/hooks/useAdvancedPerformance'

import { Card } from '@/react-app/components/ui/Card'
import Button from '@/react-app/components/ui/Button'
import { Badge } from '@/react-app/components/ui/Badge'

// Demo components for different hooks
const DebounceThrottleDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [throttleCount, setThrottleCount] = useState(0)
  const [debounceResult, setDebounceResult] = useState('')

  const debouncedSearch = useDebouncedCallback((term: string) => {
    setDebounceResult(`Searched for: "${term}"`)
  }, 500)

  const throttledIncrement = useThrottledCallback(() => {
    setThrottleCount(prev => prev + 1)
  }, 1000)

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Debounce & Throttle Demo</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Debounced Search (500ms delay)
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              debouncedSearch(e.target.value)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type to search..."
          />
          {debounceResult && (
            <p className="mt-2 text-sm text-green-600">{debounceResult}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Throttled Counter (max 1/second)
          </label>
          <div className="flex items-center gap-4">
            <Button onClick={throttledIncrement}>
              Increment (Click rapidly!)
            </Button>
            <Badge variant="secondary">Count: {throttleCount}</Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}

const AsyncMemoDemo: React.FC = () => {
  const [userId, setUserId] = useState(1)
  
  const userData = useAsyncMemo(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        fetchedAt: new Date().toISOString()
      }
    },
    [userId],
    { id: 0, name: 'Loading...', email: '', fetchedAt: '' }
  )

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Async Memo Demo</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setUserId(prev => prev + 1)}>
            Load Next User
          </Button>
          <Badge>Current User ID: {userId}</Badge>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">User Data:</h4>
          <pre className="text-sm text-gray-600">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  )
}

const DeepMemoDemo: React.FC = () => {
  const [filters, setFilters] = useState({ category: 'all', minPrice: 0 })
  
  const expensiveComputation = useDeepMemo(() => {
    console.log('🔄 Running expensive computation with filters:', filters)
    // Simulate expensive computation
    const start = performance.now()
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += Math.random() * filters.minPrice
    }
    const duration = performance.now() - start
    
    return {
      result: result.toFixed(2),
      computationTime: duration.toFixed(2),
      filters: { ...filters }
    }
  }, [filters])

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Deep Memo Demo</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Computation Result:</h4>
          <p className="text-sm text-gray-600">Result: {expensiveComputation.result}</p>
          <p className="text-sm text-gray-600">Computation Time: {expensiveComputation.computationTime}ms</p>
          <p className="text-sm text-gray-500 mt-2">
            💡 Only recomputes when filters object deeply changes
          </p>
        </div>
      </div>
    </Card>
  )
}

const RenderTrackingDemo: React.FC<{ title: string; color: string }> = ({ title, color }) => {
  const renderCount = useRenderCount('RenderTrackingDemo')
  
  useWhyDidYouUpdate('RenderTrackingDemo', { title, color })
  
  return (
    <div className="p-4 rounded-lg border-2" style={{ borderColor: color }}>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">
        Rendered {renderCount} times
      </p>
    </div>
  )
}

const VirtualScrollingDemo: React.FC = () => {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    value: Math.random() * 100
  }))

  const { visibleItems, totalHeight, handleScroll } = useVirtualScrolling(
    items,
    60, // item height
    400  // container height
  )

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Virtual Scrolling Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        Rendering {visibleItems.length} of {items.length} items
      </p>
      
      <div 
        className="border rounded-lg overflow-auto"
        style={{ height: 400 }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ item, offsetY }) => (
            <div
              key={item.id}
              className="absolute w-full px-4 py-4 border-b flex justify-between items-center bg-white hover:bg-gray-50"
              style={{
                top: offsetY,
                height: 60
              }}
            >
              <div>
                <span className="font-medium">{item.name}</span>
              </div>
              <Badge variant="secondary">
                {item.value.toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

const IntersectionObserverDemo: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useIntersectionObserver(elementRef, {
    threshold: 0.5,
    rootMargin: '20px'
  })

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Intersection Observer Demo</h3>
      
      <div className="space-y-4">
        <div className="h-32 overflow-y-auto border rounded-lg p-4">
          <div className="h-20 bg-gray-100 rounded mb-4">
            <p className="text-center py-8 text-gray-500">Scroll down...</p>
          </div>
          
          <div 
            ref={elementRef}
            className={`h-20 rounded transition-colors duration-300 flex items-center justify-center ${
              isIntersecting ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isIntersecting ? '👁️ Visible!' : '👻 Hidden'}
          </div>
          
          <div className="h-20 bg-gray-100 rounded mt-4">
            <p className="text-center py-8 text-gray-500">Keep scrolling...</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

const PerformanceMeasurementDemo: React.FC = () => {
  const { measurements, startMeasurement, endMeasurement, getAverageDuration, clearMeasurements } = 
    usePerformanceMeasurement('complex-operation')

  const runComplexOperation = useCallback(() => {
    startMeasurement()
    
    // Simulate complex operation
    const iterations = Math.floor(Math.random() * 1000000) + 500000
    let result = 0
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i)
    }
    
    const duration = endMeasurement()
    console.log('Complex operation completed in', duration, 'ms')
  }, [startMeasurement, endMeasurement])

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Performance Measurement Demo</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={runComplexOperation}>
            Run Complex Operation
          </Button>
          <Button variant="secondary" onClick={clearMeasurements}>
            Clear Measurements
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Measurements:</h4>
          <p className="text-sm text-gray-600">Total runs: {measurements.length}</p>
          <p className="text-sm text-gray-600">Average duration: {getAverageDuration().toFixed(2)}ms</p>
          
          {measurements.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {measurements.slice(-5).map((measurement, measurementIndex) => (
                <p key={measurementIndex} className="text-xs text-gray-500">
                  Run {measurements.length - 4 + measurementIndex}: {measurement.duration.toFixed(2)}ms
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

const MemoryMonitoringDemo: React.FC = () => {
  const { memoryInfo, getMemoryUsagePercentage } = useMemoryMonitoring(2000)

  const formatBytes = (bytes: number = 0) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Memory Monitoring Demo</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Memory Usage</h4>
          <p className="text-sm text-gray-600">Used: {formatBytes(memoryInfo.usedJSHeapSize)}</p>
          <p className="text-sm text-gray-600">Total: {formatBytes(memoryInfo.totalJSHeapSize)}</p>
          <p className="text-sm text-gray-600">Limit: {formatBytes(memoryInfo.jsHeapSizeLimit)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Usage Percentage</h4>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(getMemoryUsagePercentage(), 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {getMemoryUsagePercentage().toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  )
}

const ExpensiveComputationDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState(100)
  
  const { result, isComputing, clearCache, cacheSize } = useExpensiveComputation(
    () => {
      // Simulate expensive computation
      let sum = 0
      for (let i = 0; i < inputValue * 10000; i++) {
        sum += Math.sqrt(i) * Math.log(i + 1)
      }
      return sum.toFixed(2)
    },
    [inputValue],
    { debounce: 300, cache: true, maxCacheSize: 5 }
  )

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Expensive Computation Demo</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Value (affects computation complexity)
          </label>
          <input
            type="range"
            min="10"
            max="500"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">Value: {inputValue}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            Computation Result:
            {isComputing && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Computing...
              </span>
            )}
          </h4>
          <p className="text-lg font-mono">{result || 'No result yet'}</p>
          <p className="text-xs text-gray-500 mt-2">
            Cache size: {cacheSize}/5 | Debounced by 300ms
          </p>
        </div>

        <Button variant="secondary" onClick={clearCache}>
          Clear Cache
        </Button>
      </div>
    </Card>
  )
}

export default function AdvancedPerformanceDemo() {
  const [demoTitle, setDemoTitle] = useState('Advanced Performance Hooks')
  const [demoColor, setDemoColor] = useState('#3b82f6')
  
  const { lifecycleEvents, getTotalLifetime } = useLifecycleTracking('AdvancedPerformanceDemo')

  return (
    <div className="space-y-6 p-6">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Advanced Performance Hooks Demo
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive demonstration of advanced React performance optimization hooks
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span>Total component lifetime: {getTotalLifetime()}ms</span>
              <span>Lifecycle events: {lifecycleEvents.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Debounce & Throttle */}
            <DebounceThrottleDemo />

            {/* Async Memo */}
            <AsyncMemoDemo />

            {/* Deep Memo */}
            <div className="lg:col-span-2">
              <DeepMemoDemo />
            </div>

            {/* Render Tracking */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Render Tracking Demo</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={demoTitle}
                      onChange={(e) => setDemoTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={demoColor}
                      onChange={(e) => setDemoColor(e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <RenderTrackingDemo title={demoTitle} color={demoColor} />
              </div>
            </Card>

            {/* Intersection Observer */}
            <IntersectionObserverDemo />

            {/* Virtual Scrolling */}
            <div className="lg:col-span-2">
              <VirtualScrollingDemo />
            </div>

            {/* Performance Measurement */}
            <PerformanceMeasurementDemo />

            {/* Memory Monitoring */}
            <MemoryMonitoringDemo />

            {/* Expensive Computation */}
            <div className="lg:col-span-2">
              <ExpensiveComputationDemo />
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🎯 Optimization Tips</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Use debouncing for search inputs</li>
                  <li>• Throttle scroll and resize events</li>
                  <li>• Cache expensive computations</li>
                  <li>• Monitor render counts in dev</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">⚡ Best Practices</h4>
                <ul className="text-green-800 space-y-1">
                  <li>• Deep memoize complex objects</li>
                  <li>• Use virtual scrolling for long lists</li>
                  <li>• Implement intersection observers</li>
                  <li>• Track memory usage patterns</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🔧 Debug Tools</h4>
                <ul className="text-purple-800 space-y-1">
                  <li>• useWhyDidYouUpdate for rerenders</li>
                  <li>• Performance measurements</li>
                  <li>• Lifecycle event tracking</li>
                  <li>• Memory monitoring alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
