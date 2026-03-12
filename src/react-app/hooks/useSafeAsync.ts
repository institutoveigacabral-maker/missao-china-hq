import { useCallback, useEffect, useRef } from 'react'
import { useSafeAsyncState, useSafeFetch } from '@/react-app/utils/memoryLeakPatterns'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

/**
 * Hook seguro para operações assíncronas que previne vazamentos de memória
 * e atualizações de estado em componentes desmontados
 */
export const useSafeAsync = <T = any>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncOptions = {}
) => {
  const { immediate = true, onSuccess, onError } = options
  
  const [state, setSafeState] = useSafeAsyncState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })
  
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const execute = useCallback(async () => {
    if (!isMountedRef.current) return
    
    setSafeState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await asyncFunction()
      
      if (isMountedRef.current) {
        setSafeState({
          data: result,
          loading: false,
          error: null
        })
        
        onSuccess?.(result)
      }
    } catch (error) {
      if (isMountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        
        setSafeState({
          data: null,
          loading: false,
          error: errorMessage
        })
        
        onError?.(errorMessage)
      }
    }
  }, [asyncFunction, setSafeState, onSuccess, onError])
  
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, deps)
  
  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setSafeState({
        data: null,
        loading: false,
        error: null
      })
    }
  }, [setSafeState])
  
  return {
    ...state,
    execute,
    reset
  }
}

/**
 * Hook seguro para fetch API com prevenção de vazamentos
 */
export const useSafeApiCall = <T = any>(
  url: string | null,
  options: RequestInit = {},
  deps: React.DependencyList = []
) => {
  const { safeFetch } = useSafeFetch()
  
  const asyncFunction = useCallback(async (): Promise<T> => {
    if (!url) throw new Error('URL não fornecida')
    
    const response = await safeFetch(url, options)
    if (!response) throw new Error('Request foi cancelado')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
  }, [url, safeFetch, JSON.stringify(options)])
  
  return useSafeAsync<T>(asyncFunction, [url, ...deps], {
    immediate: !!url
  })
}

/**
 * Hook para polling seguro com cleanup automático
 */
export const useSafePolling = <T = any>(
  asyncFunction: () => Promise<T>,
  interval: number,
  options: UseAsyncOptions & { enabled?: boolean } = {}
) => {
  const { enabled = true, ...asyncOptions } = options
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  
  const asyncHook = useSafeAsync<T>(asyncFunction, [], {
    ...asyncOptions,
    immediate: enabled
  })
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  useEffect(() => {
    if (!enabled || !isMountedRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current && !asyncHook.loading) {
        asyncHook.execute()
      }
    }, interval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, interval, asyncHook.execute, asyncHook.loading])
  
  const start = useCallback(() => {
    if (isMountedRef.current) {
      asyncHook.execute()
    }
  }, [asyncHook.execute])
  
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])
  
  return {
    ...asyncHook,
    start,
    stop,
    isPolling: !!intervalRef.current
  }
}

export default {
  useSafeAsync,
  useSafeApiCall,
  useSafePolling
}
