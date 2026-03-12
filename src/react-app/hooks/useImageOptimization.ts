import { useState, useEffect, useCallback, useRef } from 'react'

interface ImageOptimizationConfig {
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto'
  lazy?: boolean
  preload?: boolean
  priority?: 'high' | 'low'
  fallback?: string
}

interface ImageMetrics {
  loadTime: number
  size: number
  format: string
  cached: boolean
}

interface UseImageOptimizationResult {
  optimizedSrc: string
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  metrics: ImageMetrics | null
  retry: () => void
  preload: () => Promise<void>
}

export const useImageOptimization = (
  src: string,
  config: ImageOptimizationConfig = {}
): UseImageOptimizationResult => {
  const {
    quality = 80,
    format = 'auto',
    preload = false,
    fallback
  } = config

  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null)
  const [optimizedSrc, setOptimizedSrc] = useState(src)
  
  const loadStartTime = useRef<number>(0)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Optimize image URL based on config
  const optimizeImageUrl = useCallback((url: string): string => {
    // Detect if we're using a CDN that supports optimization
    if (url.includes('mocha-cdn.com') || url.includes('unsplash.com')) {
      const params = new URLSearchParams()
      
      // Add optimization parameters
      if (quality !== 80) params.set('q', quality.toString())
      if (format !== 'auto') params.set('fm', format)
      
      // For Unsplash specifically
      if (url.includes('unsplash.com')) {
        params.set('auto', 'format,compress')
        if (quality < 80) params.set('q', quality.toString())
      }
      
      const separator = url.includes('?') ? '&' : '?'
      return params.toString() ? `${url}${separator}${params.toString()}` : url
    }
    
    return url
  }, [quality, format])

  // Get optimal format based on browser support
  const getOptimalFormat = useCallback((): string => {
    if (format !== 'auto') return format
    
    // Create a test canvas to check format support
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    
    // Check AVIF support
    try {
      if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) {
        return 'avif'
      }
    } catch {}
    
    // Check WebP support
    try {
      if (canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
        return 'webp'
      }
    } catch {}
    
    // Fallback to JPEG
    return 'jpg'
  }, [format])

  // Preload image function
  const preloadImage = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      loadStartTime.current = performance.now()
      
      img.onload = () => {
        const loadTime = performance.now() - loadStartTime.current
        
        // Calculate metrics
        const metrics: ImageMetrics = {
          loadTime,
          size: 0, // Would need to be calculated differently for real size
          format: getOptimalFormat(),
          cached: loadTime < 50 // Assume cached if very fast
        }
        
        setMetrics(metrics)
        setIsLoaded(true)
        setIsLoading(false)
        setHasError(false)
        resolve()
      }
      
      img.onerror = () => {
        setHasError(true)
        setIsLoading(false)
        
        // Try fallback if available
        if (fallback) {
          img.src = fallback
        } else {
          reject(new Error(`Failed to load image: ${src}`))
        }
      }
      
      img.src = optimizedSrc
      imgRef.current = img
    })
  }, [optimizedSrc, fallback, src, getOptimalFormat])

  // Retry function
  const retry = useCallback(() => {
    setHasError(false)
    setIsLoaded(false)
    setIsLoading(true)
    preloadImage()
  }, [preloadImage])

  // Initialize optimized source
  useEffect(() => {
    const newOptimizedSrc = optimizeImageUrl(src)
    setOptimizedSrc(newOptimizedSrc)
  }, [src, optimizeImageUrl])

  // Handle preloading
  useEffect(() => {
    if (preload && !isLoaded && !hasError) {
      setIsLoading(true)
      preloadImage()
    }
  }, [preload, preloadImage, isLoaded, hasError])

  return {
    optimizedSrc,
    isLoading,
    isLoaded,
    hasError,
    metrics,
    retry,
    preload: preloadImage
  }
}

// Hook for batch image optimization
export const useBatchImageOptimization = (
  sources: string[]
) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [loadedStates, setLoadedStates] = useState<Record<string, boolean>>({})
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({})
  const [allMetrics, setAllMetrics] = useState<Record<string, ImageMetrics>>({})

  const preloadAll = useCallback(async (options?: {
    concurrency?: number
    priority?: 'high' | 'low'
  }) => {
    const { concurrency = 3, priority = 'low' } = options || {}
    
    const chunks = []
    for (let i = 0; i < sources.length; i += concurrency) {
      chunks.push(sources.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async (src) => {
        setLoadingStates(prev => ({ ...prev, [src]: true }))
        
        try {
          const img = new Image()
          const startTime = performance.now()
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error(`Failed to load ${src}`))
            img.src = src
          })
          
          const loadTime = performance.now() - startTime
          const metrics: ImageMetrics = {
            loadTime,
            size: 0,
            format: 'auto',
            cached: loadTime < 50
          }
          
          setAllMetrics(prev => ({ ...prev, [src]: metrics }))
          setLoadedStates(prev => ({ ...prev, [src]: true }))
        } catch {
          setErrorStates(prev => ({ ...prev, [src]: true }))
        } finally {
          setLoadingStates(prev => ({ ...prev, [src]: false }))
        }
      })
      
      await Promise.allSettled(promises)
      
      // Add delay for low priority
      if (priority === 'low') {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }, [sources])

  const stats = {
    total: sources.length,
    loading: Object.values(loadingStates).filter(Boolean).length,
    loaded: Object.values(loadedStates).filter(Boolean).length,
    failed: Object.values(errorStates).filter(Boolean).length,
    avgLoadTime: Object.values(allMetrics).length > 0 
      ? Object.values(allMetrics).reduce((sum, m) => sum + m.loadTime, 0) / Object.values(allMetrics).length
      : 0
  }

  return {
    preloadAll,
    stats,
    isLoading: (src: string) => loadingStates[src] || false,
    isLoaded: (src: string) => loadedStates[src] || false,
    hasError: (src: string) => errorStates[src] || false,
    getMetrics: (src: string) => allMetrics[src] || null
  }
}

// Hook for intelligent image format detection
export const useImageFormatDetection = () => {
  const [supportedFormats, setSupportedFormats] = useState<{
    webp: boolean
    avif: boolean
    jpeg: boolean
    png: boolean
  }>({
    webp: false,
    avif: false,
    jpeg: true,
    png: true
  })

  useEffect(() => {
    const detectFormats = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      
      const formats = {
        webp: false,
        avif: false,
        jpeg: true,
        png: true
      }
      
      // Test WebP
      try {
        formats.webp = canvas.toDataURL('image/webp').startsWith('data:image/webp')
      } catch {}
      
      // Test AVIF
      try {
        formats.avif = canvas.toDataURL('image/avif').startsWith('data:image/avif')
      } catch {}
      
      setSupportedFormats(formats)
    }
    
    detectFormats()
  }, [])

  const getBestFormat = useCallback((preferredFormat?: string): string => {
    if (preferredFormat && supportedFormats[preferredFormat as keyof typeof supportedFormats]) {
      return preferredFormat
    }
    
    if (supportedFormats.avif) return 'avif'
    if (supportedFormats.webp) return 'webp'
    return 'jpeg'
  }, [supportedFormats])

  return {
    supportedFormats,
    getBestFormat
  }
}
