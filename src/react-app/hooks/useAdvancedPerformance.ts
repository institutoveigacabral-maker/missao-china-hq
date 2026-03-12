import { 
  useCallback, 
  useMemo, 
  useRef, 
  useEffect, 
  useState,
  DependencyList 
} from 'react'

// Debounced callback hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...deps]) as T

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
): T => {
  const lastRun = useRef(Date.now())
  
  const throttledCallback = useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay, ...deps]) as T

  return throttledCallback
}

// Memoized async operation
export const useAsyncMemo = <T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList,
  initialValue: T
): T => {
  const [value, setValue] = useState<T>(initialValue)
  
  useEffect(() => {
    let cancelled = false
    
    asyncFn().then(result => {
      if (!cancelled) {
        setValue(result)
      }
    }).catch(console.error)
    
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  
  return value
}

// Deep comparison memoization
export const useDeepMemo = <T>(
  factory: () => T,
  deps: DependencyList
): T => {
  const ref = useRef<{ deps: DependencyList; value: T } | undefined>(undefined)
  
  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory()
    }
  }
  
  return ref.current.value
}

// Performance monitoring hook
export const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0)
  
  useEffect(() => {
    renderCount.current += 1
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`)
    }
  })
  
  return renderCount.current
}

// Why did you update hook
export const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previousProps = useRef<Record<string, any> | undefined>(undefined)
  
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: any; to: any }> = {}
      
      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          }
        }
      })
      
      if (Object.keys(changedProps).length && process.env.NODE_ENV === 'development') {
        console.log('[useWhyDidYouUpdate]', name, changedProps)
      }
    }
    
    previousProps.current = props
  }, [name, props])
}

// Virtual scrolling hook
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      offsetY: (startIndex + index) * itemHeight
    }))
  }, [items, itemHeight, containerHeight, scrollTop])
  
  const totalHeight = items.length * itemHeight
  
  const handleScroll = useThrottledCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, 16) // ~60fps
  
  return {
    visibleItems,
    totalHeight,
    handleScroll
  }
}

// Intersection observer hook for performance
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [elementRef, options])
  
  return isIntersecting
}

// Advanced performance measurement hook
export const usePerformanceMeasurement = (measurementName: string) => {
  const [measurements, setMeasurements] = useState<{
    duration: number
    timestamp: number
  }[]>([])

  const startMeasurement = useCallback(() => {
    performance.mark(`${measurementName}-start`)
  }, [measurementName])

  const endMeasurement = useCallback(() => {
    performance.mark(`${measurementName}-end`)
    performance.measure(measurementName, `${measurementName}-start`, `${measurementName}-end`)
    
    const entries = performance.getEntriesByName(measurementName)
    const latestEntry = entries[entries.length - 1]
    
    if (latestEntry) {
      setMeasurements(prev => [...prev, {
        duration: latestEntry.duration,
        timestamp: latestEntry.startTime
      }])
    }
    
    return latestEntry?.duration || 0
  }, [measurementName])

  const getAverageDuration = useCallback(() => {
    if (measurements.length === 0) return 0
    return measurements.reduce((sum, m) => sum + m.duration, 0) / measurements.length
  }, [measurements])

  const clearMeasurements = useCallback(() => {
    setMeasurements([])
    performance.clearMeasures(measurementName)
    performance.clearMarks(`${measurementName}-start`)
    performance.clearMarks(`${measurementName}-end`)
  }, [measurementName])

  return {
    measurements,
    startMeasurement,
    endMeasurement,
    getAverageDuration,
    clearMeasurements
  }
}

// Memory usage monitoring hook
export const useMemoryMonitoring = (interval: number = 5000) => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number
    totalJSHeapSize?: number
    jsHeapSizeLimit?: number
  }>({})

  useEffect(() => {
    if (!('memory' in performance)) return

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      })
    }

    updateMemoryInfo()
    const intervalId = setInterval(updateMemoryInfo, interval)

    return () => clearInterval(intervalId)
  }, [interval])

  const getMemoryUsagePercentage = useCallback(() => {
    if (!memoryInfo.usedJSHeapSize || !memoryInfo.jsHeapSizeLimit) return 0
    return (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
  }, [memoryInfo])

  return {
    memoryInfo,
    getMemoryUsagePercentage
  }
}

// Component lifecycle tracking hook
export const useLifecycleTracking = (componentName: string) => {
  const mountTime = useRef(Date.now())
  const [lifecycleEvents, setLifecycleEvents] = useState<{
    event: string
    timestamp: number
    duration?: number
  }[]>([])

  const logEvent = useCallback((event: string, duration?: number) => {
    const timestamp = Date.now()
    setLifecycleEvents(prev => [...prev, { event, timestamp, duration }])
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName}: ${event}`, { timestamp, duration })
    }
  }, [componentName])

  useEffect(() => {
    logEvent('mounted')
    
    return () => {
      const unmountTime = Date.now()
      const totalLifetime = unmountTime - mountTime.current
      logEvent('unmounting', totalLifetime)
    }
  }, [logEvent])

  const getTotalLifetime = useCallback(() => {
    return Date.now() - mountTime.current
  }, [])

  return {
    lifecycleEvents,
    logEvent,
    getTotalLifetime
  }
}

// Expensive computation optimization hook
export const useExpensiveComputation = <T>(
  computationFn: () => T,
  deps: DependencyList,
  options: {
    debounce?: number
    cache?: boolean
    maxCacheSize?: number
  } = {}
) => {
  const { debounce = 0, cache = true, maxCacheSize = 10 } = options
  const cacheRef = useRef(new Map<string, T>())
  const [result, setResult] = useState<T>()
  const [isComputing, setIsComputing] = useState(false)

  const debouncedComputation = useDebouncedCallback(() => {
    setIsComputing(true)
    const startTime = performance.now()
    
    const cacheKey = cache ? JSON.stringify(deps) : ''
    
    if (cache && cacheRef.current.has(cacheKey)) {
      setResult(cacheRef.current.get(cacheKey))
      setIsComputing(false)
      return
    }

    try {
      const computedResult = computationFn()
      
      if (cache) {
        // Maintain cache size limit
        if (cacheRef.current.size >= maxCacheSize) {
          const firstKey = cacheRef.current.keys().next().value
          if (firstKey !== undefined) {
            cacheRef.current.delete(firstKey)
          }
        }
        cacheRef.current.set(cacheKey, computedResult)
      }
      
      setResult(computedResult)
      
      const duration = performance.now() - startTime
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`⚠️ Expensive computation took ${duration.toFixed(2)}ms`)
      }
    } finally {
      setIsComputing(false)
    }
  }, debounce, deps)

  useEffect(() => {
    debouncedComputation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  return {
    result,
    isComputing,
    clearCache,
    cacheSize: cacheRef.current.size
  }
}

// Helper functions
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }
  
  if (a.prototype !== b.prototype) return false
  
  let keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }
  
  return keys.every(k => deepEqual(a[k], b[k]))
}
