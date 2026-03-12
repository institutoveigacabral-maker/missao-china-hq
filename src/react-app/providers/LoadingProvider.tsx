import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingState {
  [key: string]: boolean
}

interface LoadingContextType {
  loadingStates: LoadingState
  setLoading: (key: string, isLoading: boolean) => void
  isLoading: (key: string) => boolean
  isAnyLoading: () => boolean
  getLoadingKeys: () => string[]
  clearAllLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
  debug?: boolean
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children, debug = false }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    if (debug) {
      console.log(`Loading ${key}: ${isLoading}`)
    }
    
    setLoadingStates(prev => {
      if (isLoading) {
        return { ...prev, [key]: true }
      } else {
        const { [key]: _, ...rest } = prev
        return rest
      }
    })
  }, [debug])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const isAnyLoading = useCallback(() => {
    return Object.keys(loadingStates).length > 0
  }, [loadingStates])

  const getLoadingKeys = useCallback(() => {
    return Object.keys(loadingStates)
  }, [loadingStates])

  const clearAllLoading = useCallback(() => {
    if (debug) {
      console.log('Clearing all loading states')
    }
    setLoadingStates({})
  }, [debug])

  const value: LoadingContextType = {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    getLoadingKeys,
    clearAllLoading,
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoadingContext = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider')
  }
  return context
}

export const useLoading = (key: string) => {
  const { setLoading, isLoading } = useLoadingContext()
  
  const start = useCallback(() => setLoading(key, true), [key, setLoading])
  const stop = useCallback(() => setLoading(key, false), [key, setLoading])
  
  return {
    isLoading: isLoading(key),
    start,
    stop,
  }
}
