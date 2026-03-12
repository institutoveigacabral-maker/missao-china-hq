import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Memory Leak Prevention Patterns for React
 * 
 * Este arquivo contém padrões seguros para prevenir vazamentos de memória
 * comuns em aplicações React, especialmente para operações assíncronas,
 * event listeners e timers.
 */

// Pattern 1: Safe useEffect cleanup
export const useSafeEffect = () => {
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  return isMountedRef
}

// Pattern 2: Event listener cleanup
export const useEventListener = <T extends Event = Event>(
  eventName: string,
  handler: (event: T) => void,
  element: EventTarget | null = window
) => {
  const savedHandler = useRef<((event: T) => void) | undefined>(undefined)
  
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])
  
  useEffect(() => {
    if (!element) return
    
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as T)
      }
    }
    
    element.addEventListener(eventName, eventListener)
    
    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

// Pattern 3: Safe async state updates
export const useSafeAsyncState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState)
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const setSafeState = useCallback((newState: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setState(newState)
    }
  }, [])
  
  return [state, setSafeState] as const
}

// Pattern 4: Safe timer management
export const useSafeTimer = () => {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return
    
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        callback()
        timersRef.current.delete(timer)
      }
    }, delay)
    
    timersRef.current.add(timer)
    return timer
  }, [])
  
  const setSafeInterval = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return
    
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        callback()
      } else {
        clearInterval(interval)
        intervalsRef.current.delete(interval)
      }
    }, delay)
    
    intervalsRef.current.add(interval)
    return interval
  }, [])
  
  const clearSafeTimeout = useCallback((timer: NodeJS.Timeout) => {
    clearTimeout(timer)
    timersRef.current.delete(timer)
  }, [])
  
  const clearSafeInterval = useCallback((interval: NodeJS.Timeout) => {
    clearInterval(interval)
    intervalsRef.current.delete(interval)
  }, [])
  
  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer))
      intervalsRef.current.forEach(interval => clearInterval(interval))
      timersRef.current.clear()
      intervalsRef.current.clear()
    }
  }, [])
  
  return {
    setSafeTimeout,
    setSafeInterval,
    clearSafeTimeout,
    clearSafeInterval
  }
}

// Pattern 5: Safe fetch with abort controller
export const useSafeFetch = () => {
  const abortControllersRef = useRef<Set<AbortController>>(new Set())
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const safeFetch = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response | null> => {
    if (!isMountedRef.current) return null
    
    const controller = new AbortController()
    abortControllersRef.current.add(controller)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      abortControllersRef.current.delete(controller)
      
      if (!isMountedRef.current) return null
      return response
    } catch (error) {
      abortControllersRef.current.delete(controller)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted safely')
        return null
      }
      
      if (!isMountedRef.current) return null
      throw error
    }
  }, [])
  
  // Cleanup all pending requests on unmount
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach(controller => {
        controller.abort()
      })
      abortControllersRef.current.clear()
    }
  }, [])
  
  return { safeFetch }
}

// Pattern 6: Safe WebSocket management
export const useSafeWebSocket = (url: string | null) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED)
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  useEffect(() => {
    if (!url || !isMountedRef.current) return
    
    const ws = new WebSocket(url)
    
    const handleOpen = () => {
      if (isMountedRef.current) {
        setReadyState(WebSocket.OPEN)
      }
    }
    
    const handleClose = () => {
      if (isMountedRef.current) {
        setReadyState(WebSocket.CLOSED)
        setSocket(null)
      }
    }
    
    const handleError = () => {
      if (isMountedRef.current) {
        setReadyState(WebSocket.CLOSED)
      }
    }
    
    ws.addEventListener('open', handleOpen)
    ws.addEventListener('close', handleClose)
    ws.addEventListener('error', handleError)
    
    if (isMountedRef.current) {
      setSocket(ws)
      setReadyState(ws.readyState)
    }
    
    return () => {
      ws.removeEventListener('open', handleOpen)
      ws.removeEventListener('close', handleClose)
      ws.removeEventListener('error', handleError)
      
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
      
      setSocket(null)
      setReadyState(WebSocket.CLOSED)
    }
  }, [url])
  
  const sendMessage = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && isMountedRef.current) {
      socket.send(message)
    }
  }, [socket])
  
  return {
    socket,
    readyState,
    sendMessage
  }
}

// Pattern 7: Safe intersection observer
export const useSafeIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const observe = useCallback((element: Element) => {
    if (!isMountedRef.current) return
    
    if (observerRef.current) {
      observerRef.current.observe(element)
    } else {
      observerRef.current = new IntersectionObserver(
        (entries, observer) => {
          if (isMountedRef.current) {
            callback(entries, observer)
          }
        },
        options
      )
      observerRef.current.observe(element)
    }
  }, [callback, options])
  
  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element)
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])
  
  return { observe, unobserve }
}

// Pattern 8: Memory leak detector (Development only)
export const useMemoryLeakDetector = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 ${componentName} mounted`)
      
      return () => {
        console.log(`🔴 ${componentName} unmounted`)
        
        // Check for common leak patterns
        setTimeout(() => {
          if (window.performance && (window.performance as any).memory) {
            const memory = (window.performance as any).memory
            console.log(`📊 Memory after ${componentName} unmount:`, {
              used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
              total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
              limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            })
          }
        }, 100)
      }
    }
  }, [componentName])
}

// Utility: Debounced safe state setter
export const useSafeDebouncedState = <T>(initialValue: T, delay: number = 300) => {
  const [state, setSafeState] = useSafeAsyncState(initialValue)
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimer()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const setDebouncedState = useCallback((value: T | ((prev: T) => T)) => {
    if (timeoutRef.current) {
      clearSafeTimeout(timeoutRef.current)
    }
    
    const timer = setSafeTimeout(() => {
      setSafeState(value)
      timeoutRef.current = null
    }, delay)
    
    timeoutRef.current = timer || null
  }, [setSafeState, setSafeTimeout, clearSafeTimeout, delay])
  
  return [state, setDebouncedState] as const
}

// Utility: Safe localStorage with error handling
export const useSafeLocalStorage = <T>(key: string, initialValue: T) => {
  const getInitialValue = (): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }
  
  const [storedValue, setStoredValue] = useSafeAsyncState<T>(getInitialValue())
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = typeof value === 'function' ? (value as (val: T) => T)(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue, setStoredValue])
  
  return [storedValue, setValue] as const
}

/**
 * Common Memory Leak Patterns to Watch For:
 * 
 * 1. ❌ Uncleared timers (setTimeout, setInterval)
 * 2. ❌ Event listeners not removed
 * 3. ❌ Fetch requests not aborted
 * 4. ❌ WebSocket connections not closed
 * 5. ❌ State updates after component unmount
 * 6. ❌ Observers not disconnected
 * 7. ❌ Large objects in closure scope
 * 8. ❌ Circular references
 * 
 * ✅ Solutions:
 * - Always cleanup in useEffect return
 * - Use AbortController for fetch
 * - Check component mounted state before state updates
 * - Use WeakMap/WeakSet for object references
 * - Disconnect observers properly
 * - Clear timers and intervals
 */

export default {
  useSafeEffect,
  useEventListener,
  useSafeAsyncState,
  useSafeTimer,
  useSafeFetch,
  useSafeWebSocket,
  useSafeIntersectionObserver,
  useMemoryLeakDetector,
  useSafeDebouncedState,
  useSafeLocalStorage
}
