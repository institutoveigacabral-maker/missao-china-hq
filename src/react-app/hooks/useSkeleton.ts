import { useState, useEffect, useCallback } from 'react'
import { useLoadingContext } from '@/react-app/providers/LoadingProvider'

interface UseSkeletonOptions {
  delay?: number
  minDuration?: number
  showShimmer?: boolean
  onStart?: () => void
  onEnd?: () => void
}

export const useSkeleton = (key: string, options: UseSkeletonOptions = {}) => {
  const {
    delay = 0,
    minDuration = 500,
    showShimmer = true,
    onStart,
    onEnd
  } = options

  const { isLoading, setLoading } = useLoadingContext()
  const [shouldShow, setShouldShow] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  const isSkeletonLoading = isLoading(key)

  // Handle delay before showing skeleton
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isSkeletonLoading && delay > 0) {
      timeoutId = setTimeout(() => {
        setShouldShow(true)
        setStartTime(Date.now())
        onStart?.()
      }, delay)
    } else if (isSkeletonLoading) {
      setShouldShow(true)
      setStartTime(Date.now())
      onStart?.()
    } else {
      // Handle minimum duration before hiding
      if (startTime && minDuration > 0) {
        const elapsed = Date.now() - startTime
        const remaining = minDuration - elapsed

        if (remaining > 0) {
          timeoutId = setTimeout(() => {
            setShouldShow(false)
            setStartTime(null)
            onEnd?.()
          }, remaining)
        } else {
          setShouldShow(false)
          setStartTime(null)
          onEnd?.()
        }
      } else {
        setShouldShow(false)
        setStartTime(null)
        onEnd?.()
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isSkeletonLoading, delay, minDuration, startTime, onStart, onEnd])

  const start = useCallback(() => {
    setLoading(key, true)
  }, [key, setLoading])

  const stop = useCallback(() => {
    setLoading(key, false)
  }, [key, setLoading])

  return {
    isLoading: isSkeletonLoading,
    shouldShow,
    showShimmer,
    start,
    stop
  }
}

// Hook para skeleton em promesses
export const useSkeletonPromise = <T>(
  key: string,
  options: UseSkeletonOptions = {}
) => {
  const skeleton = useSkeleton(key, options)

  const executeWithSkeleton = useCallback(async (
    promise: () => Promise<T>
  ): Promise<T> => {
    skeleton.start()
    try {
      const result = await promise()
      return result
    } finally {
      skeleton.stop()
    }
  }, [skeleton])

  return {
    ...skeleton,
    executeWithSkeleton
  }
}

// Hook para skeleton automático baseado em dados
export const useAutoSkeleton = <T>(
  data: T | undefined | null,
  key: string,
  options: UseSkeletonOptions = {}
) => {
  const skeleton = useSkeleton(key, options)

  useEffect(() => {
    if (data === undefined || data === null) {
      skeleton.start()
    } else {
      skeleton.stop()
    }
  }, [data, skeleton])

  return {
    ...skeleton,
    hasData: data !== undefined && data !== null,
    data
  }
}

// Hook para skeleton em listas paginadas
export const useSkeletonPagination = (
  key: string,
  options: UseSkeletonOptions & {
    itemsPerPage?: number
    totalPages?: number
  } = {}
) => {
  const { itemsPerPage = 10, totalPages = 1, ...skeletonOptions } = options
  const skeleton = useSkeleton(key, skeletonOptions)
  const [currentPage, setCurrentPage] = useState(1)

  const loadPage = useCallback(async (
    pageNumber: number,
    loader: (page: number) => Promise<any>
  ) => {
    skeleton.start()
    setCurrentPage(pageNumber)
    
    try {
      const result = await loader(pageNumber)
      return result
    } finally {
      skeleton.stop()
    }
  }, [skeleton])

  return {
    ...skeleton,
    currentPage,
    totalPages,
    itemsPerPage,
    loadPage,
    setCurrentPage
  }
}

// Hook para skeleton com refresh automático
export const useSkeletonRefresh = (
  key: string,
  _refreshInterval: number = 30000,
  options: UseSkeletonOptions = {}
) => {
  const skeleton = useSkeleton(key, options)
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())

  const refresh = useCallback(async (
    refresher: () => Promise<void>
  ) => {
    skeleton.start()
    try {
      await refresher()
      setLastRefresh(Date.now())
    } finally {
      skeleton.stop()
    }
  }, [skeleton])

  return {
    ...skeleton,
    lastRefresh,
    refresh,
    timeSinceLastRefresh: Date.now() - lastRefresh
  }
}

// Hook para skeleton condicional
export const useConditionalSkeleton = (
  key: string,
  condition: boolean,
  options: UseSkeletonOptions = {}
) => {
  const skeleton = useSkeleton(key, options)

  useEffect(() => {
    if (condition) {
      skeleton.start()
    } else {
      skeleton.stop()
    }
  }, [condition, skeleton])

  return skeleton
}

// Hook para múltiplos skeletons coordenados
export const useSkeletonGroup = (
  keys: string[],
  options: UseSkeletonOptions = {}
) => {
  const { setLoading } = useLoadingContext()
  const skeletons = keys.map(key => useSkeleton(key, options))

  const startAll = useCallback(() => {
    keys.forEach(key => setLoading(key, true))
  }, [keys, setLoading])

  const stopAll = useCallback(() => {
    keys.forEach(key => setLoading(key, false))
  }, [keys, setLoading])

  const isAnyLoading = skeletons.some(skeleton => skeleton.isLoading)
  const areAllLoading = skeletons.every(skeleton => skeleton.isLoading)

  return {
    skeletons,
    startAll,
    stopAll,
    isAnyLoading,
    areAllLoading
  }
}
