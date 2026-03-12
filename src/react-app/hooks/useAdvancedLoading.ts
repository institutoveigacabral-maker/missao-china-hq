import { useCallback, useRef, useEffect } from 'react'
import { useLoadingContext } from '@/react-app/providers/LoadingProvider'
import { toast } from '@/react-app/components/ui/Toast'

interface UseLoadingOptions {
  key?: string
  defaultKey?: string
  timeout?: number
  retryCount?: number
  retryDelay?: number
}

interface AsyncOperationOptions {
  loadingMessage?: string
  successMessage?: string
  errorMessage?: string | false
  showToast?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  onTimeout?: () => void
}

export const useAdvancedLoading = (options: UseLoadingOptions = {}) => {
  const { key, defaultKey = 'default', timeout = 30000, retryCount = 0, retryDelay = 1000 } = options
  const { setLoading, isLoading, isAnyLoading, clearAllLoading } = useLoadingContext()
  const isMountedRef = useRef(true)

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const loadingKey = key || defaultKey

  const startLoading = useCallback((customKey?: string) => {
    if (isMountedRef.current) {
      setLoading(customKey || loadingKey, true)
    }
  }, [setLoading, loadingKey])

  const stopLoading = useCallback((customKey?: string) => {
    if (isMountedRef.current) {
      setLoading(customKey || loadingKey, false)
    }
  }, [setLoading, loadingKey])

  const isCurrentLoading = useCallback((customKey?: string) => {
    return isLoading(customKey || loadingKey)
  }, [isLoading, loadingKey])

  // Wrapper para async functions com timeout e retry
  // Fixed infinite loop by stabilizing dependencies
  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    customKey?: string,
    options: AsyncOperationOptions = {}
  ): Promise<T> => {
    const keyToUse = customKey || loadingKey
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showToast = true,
      onSuccess,
      onError,
      onTimeout
    } = options
    
    let retryAttempts = 0
    let timeoutId: NodeJS.Timeout | null = null
    
    const executeWithRetry = async (): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (onTimeout) onTimeout()
            if (showToast && errorMessage !== false) {
              toast.error('Operação expirou. Tente novamente.')
            }
            reject(new Error('Timeout'))
          }, timeout)
        }

        asyncFn()
          .then(result => {
            if (timeoutId) clearTimeout(timeoutId)
            resolve(result)
          })
          .catch(error => {
            if (timeoutId) clearTimeout(timeoutId)
            reject(error as Error)
          })
      })
    }

    try {
      if (!isMountedRef.current) return Promise.reject(new Error('Component unmounted'))
      
      startLoading(keyToUse)
      if (showToast && loadingMessage) {
        toast.loading(loadingMessage)
      }

      while (retryAttempts <= retryCount) {
        try {
          const result = await executeWithRetry()
          
          if (!isMountedRef.current) return result
          
          if (showToast && successMessage) {
            toast.success(successMessage)
          }
          
          if (onSuccess) {
            onSuccess(result)
          }
          
          return result
        } catch (error) {
          retryAttempts++
          
          if (retryAttempts <= retryCount && (error as Error).message !== 'Timeout') {
            if (showToast) {
              toast.error(`Tentativa ${retryAttempts}/${retryCount + 1} falhou. Tentando novamente...`)
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay))
            continue
          }
          
          // Final error handling
          if (isMountedRef.current && showToast && errorMessage !== false) {
            const message = typeof errorMessage === 'string' 
              ? errorMessage 
              : `Erro na operação: ${(error as Error).message}`
            toast.error(message)
          }
          
          if (isMountedRef.current && onError) {
            onError(error as Error)
          }
          
          throw error
        }
      }
    } finally {
      stopLoading(keyToUse)
      if (timeoutId) clearTimeout(timeoutId)
    }

    throw new Error('Unexpected error in withLoading')
  }, [startLoading, stopLoading, loadingKey, timeout, retryCount, retryDelay])

  // Wrapper específico para fetch operations
  const withFetch = useCallback(async <T>(
    url: string,
    fetchOptions: RequestInit = {},
    customKey?: string,
    options: AsyncOperationOptions = {}
  ): Promise<T> => {
    return withLoading(async () => {
      if (!isMountedRef.current) {
        throw new Error('Component unmounted before fetch')
      }
      
      const controller = new AbortController()
      
      // Auto-abort if component unmounts
      const checkMount = () => {
        if (!isMountedRef.current) {
          controller.abort()
        }
      }
      const intervalId = setInterval(checkMount, 100)
      
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        })
        
        clearInterval(intervalId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        return response.json()
      } catch (error) {
        clearInterval(intervalId)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request aborted due to component unmount')
        }
        throw error
      }
    }, customKey, {
      loadingMessage: `Carregando dados...`,
      errorMessage: `Erro ao carregar dados`,
      ...options
    })
  }, [withLoading])

  return {
    startLoading,
    stopLoading,
    isLoading: isCurrentLoading,
    isAnyLoading,
    withLoading,
    withFetch,
    clearAllLoading,
  }
}

// Hook específico para operações async com toast integrado
export const useAsyncOperation = (key?: string) => {
  const loading = useAdvancedLoading({ key })
  
  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T> => {
    return loading.withLoading(operation, undefined, options)
  }, [loading])

  const executeFetch = useCallback(async <T>(
    url: string,
    fetchOptions: RequestInit = {},
    options: AsyncOperationOptions = {}
  ): Promise<T> => {
    return loading.withFetch(url, fetchOptions, undefined, options)
  }, [loading])

  return {
    execute,
    executeFetch,
    isLoading: loading.isLoading(),
    startLoading: loading.startLoading,
    stopLoading: loading.stopLoading,
  }
}

// Hook para batch operations
export const useBatchLoading = (baseKey: string = 'batch') => {
  const { setLoading, isLoading } = useLoadingContext()
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  const executeBatch = useCallback(async (
    operations: Array<{
      key: string
      operation: () => Promise<any>
      options?: AsyncOperationOptions
    }>,
    onProgress?: (completed: number, total: number) => void
  ) => {
    if (!isMountedRef.current) return []
    
    const results: Array<{ key: string; result?: any; error?: Error; success: boolean }> = []
    let completed = 0

    setLoading(baseKey, true)

    try {
      for (const { key, operation, options = {} } of operations) {
        if (!isMountedRef.current) break
        
        setLoading(`${baseKey}-${key}`, true)
        
        try {
          const result = await operation()
          
          if (isMountedRef.current) {
            results.push({ key, result, success: true })
            
            if (options.onSuccess) {
              options.onSuccess(result)
            }
          }
        } catch (error) {
          const err = error as Error
          
          if (isMountedRef.current) {
            results.push({ key, error: err, success: false })
            
            if (options.onError) {
              options.onError(err)
            }
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(`${baseKey}-${key}`, false)
            completed++
            onProgress?.(completed, operations.length)
          }
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(baseKey, false)
      }
    }

    return results
  }, [baseKey, setLoading])

  return {
    executeBatch,
    isLoading: () => isLoading(baseKey),
  }
}

// Hook para polling operations
export const usePollingOperation = (
  interval: number = 5000,
  key: string = 'polling'
) => {
  const loading = useAdvancedLoading({ key })
  
  const startPolling = useCallback((
    operation: () => Promise<any>,
    options: AsyncOperationOptions = {}
  ) => {
    const intervalId = setInterval(async () => {
      if (!loading.isLoading()) {
        try {
          await loading.withLoading(operation, undefined, {
            showToast: false,
            ...options
          })
        } catch (error) {
          console.error('Polling operation failed:', error)
        }
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [loading, interval])

  return {
    startPolling,
    isLoading: loading.isLoading,
    stopLoading: loading.stopLoading
  }
}

// Hook para conditional loading
export const useConditionalLoading = (
  condition: () => boolean,
  key: string = 'conditional'
) => {
  const loading = useAdvancedLoading({ key })
  
  const executeIfCondition = useCallback(async <T>(
    operation: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T | null> => {
    if (!condition()) {
      if (options.showToast !== false) {
        toast.error('Condição não atendida para execução')
      }
      return null
    }

    return loading.withLoading(operation, undefined, options)
  }, [condition, loading])

  return {
    executeIfCondition,
    isLoading: loading.isLoading,
    condition
  }
}

// Export default object with all hooks
export default {
  useAdvancedLoading,
  useAsyncOperation,
  useBatchLoading,
  usePollingOperation,
  useConditionalLoading
}
