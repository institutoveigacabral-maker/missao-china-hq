import React, { useState, useRef, useEffect } from 'react'
import { Spinner } from './Spinner'

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto'
  lazy?: boolean
  blur?: boolean
  fallback?: string
  placeholder?: 'blur' | 'empty' | React.ReactNode
  onLoad?: () => void
  onError?: (error: Event) => void
  className?: string
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  format = 'auto',
  lazy = true,
  blur = true,
  fallback,
  placeholder = 'blur',
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(!lazy)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || inView) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, inView])

  // Generate optimized image URLs
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [1, 2, 3] // 1x, 2x, 3x pixel densities
    const formats = getOptimalFormats()
    
    return formats.map(fmt => {
      const srcSet = sizes
        .map(density => {
          const optimizedSrc = optimizeImageUrl(baseSrc, {
            width: width ? width * density : undefined,
            height: height ? height * density : undefined,
            quality,
            format: fmt,
          })
          return `${optimizedSrc} ${density}x`
        })
        .join(', ')
      
      return { format: fmt, srcSet }
    })
  }

  // Get optimal image formats based on browser support
  const getOptimalFormats = (): string[] => {
    if (format !== 'auto') return [format]
    
    const formats: string[] = []
    
    // Check AVIF support
    if (supportsFormat('avif')) formats.push('avif')
    
    // Check WebP support
    if (supportsFormat('webp')) formats.push('webp')
    
    // Fallback to original format
    const originalFormat = getImageFormat(src)
    if (originalFormat && !formats.includes(originalFormat)) {
      formats.push(originalFormat)
    }
    
    return formats.length > 0 ? formats : ['jpg']
  }

  // Check format support
  const supportsFormat = (format: string): boolean => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    
    try {
      return canvas.toDataURL(`image/${format}`).startsWith(`data:image/${format}`)
    } catch {
      return false
    }
  }

  // Extract image format from URL
  const getImageFormat = (url: string): string | null => {
    const match = url.match(/\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i)
    return match ? match[1].toLowerCase() : null
  }

  // Optimize image URL (implement your CDN logic here)
  const optimizeImageUrl = (
    url: string, 
    options: {
      width?: number
      height?: number
      quality?: number
      format?: string
    }
  ): string => {
    // For external CDNs like Cloudinary, ImageKit, etc.
    // Example for Cloudinary:
    // return url.replace('/upload/', `/upload/w_${options.width},h_${options.height},q_${options.quality},f_${options.format}/`)
    
    // For now, return original URL
    // In production, implement your image optimization service
    const params = new URLSearchParams()
    
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('f', options.format)
    
    const separator = url.includes('?') ? '&' : '?'
    return params.toString() ? `${url}${separator}${params.toString()}` : url
  }

  // Handle image load
  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  // Handle image error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true)
    onError?.(e.nativeEvent)
    
    // Try fallback image
    if (fallback && imgRef.current) {
      imgRef.current.src = fallback
      setError(false)
    }
  }

  // Render placeholder
  const renderPlaceholder = () => {
    if (placeholder === 'empty') return null
    
    if (React.isValidElement(placeholder)) {
      return placeholder
    }
    
    if (placeholder === 'blur') {
      return (
        <div 
          className={`
            absolute inset-0 flex items-center justify-center
            bg-gray-100 backdrop-blur-sm
            ${loaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
        >
          <Spinner size="sm" />
        </div>
      )
    }
    
    return null
  }

  // Don't render image until in view (for lazy loading)
  if (lazy && !inView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        {renderPlaceholder()}
      </div>
    )
  }

  // Error state
  if (error && !fallback) {
    return (
      <div 
        className={`
          bg-gray-100 flex items-center justify-center
          text-gray-500 text-sm
          ${className}
        `}
        style={{ width, height }}
      >
        ⚠️ Erro ao carregar imagem
      </div>
    )
  }

  const srcSets = generateSrcSet(src)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {/* Modern formats */}
        {srcSets.map(({ format: fmt, srcSet }) => (
          <source 
            key={fmt}
            srcSet={srcSet}
            type={`image/${fmt}`}
          />
        ))}
        
        {/* Fallback image */}
        <img
          {...props}
          ref={imgRef}
          src={optimizeImageUrl(src, { width, height, quality, format: 'jpg' })}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover
            ${loaded ? 'opacity-100' : 'opacity-0'}
            ${blur && !loaded ? 'blur-sm' : ''}
            transition-all duration-300
          `}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      </picture>
      
      {/* Placeholder overlay */}
      {!loaded && renderPlaceholder()}
    </div>
  )
}

// Utility hook for preloading images
export const useImagePreloader = (sources: string[]) => {
  const [preloaded, setPreloaded] = useState<Set<string>>(new Set())

  useEffect(() => {
    sources.forEach(src => {
      const img = new Image()
      img.onload = () => {
        setPreloaded(prev => new Set([...prev, src]))
      }
      img.src = src
    })
  }, [sources])

  return preloaded
}

// Image gallery component with lazy loading
export const ImageGallery: React.FC<{
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: number
  className?: string
}> = ({ images, columns = 3, className = '' }) => {
  return (
    <div 
      className={`
        grid gap-4
        ${columns === 2 ? 'grid-cols-2' : ''}
        ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
        ${columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''}
        ${className}
      `}
    >
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className="w-full h-48 rounded-lg"
            lazy={index > 6} // Only lazy load after first 6 images
          />
          {image.caption && (
            <p className="text-sm text-gray-600 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// Advanced image hook for smart loading
export const useAdvancedImageLoading = () => {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve()
        return
      }

      setLoadingImages(prev => new Set([...prev, src]))

      const img = new Image()
      img.onload = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(src)
          return newSet
        })
        setLoadedImages(prev => new Set([...prev, src]))
        resolve()
      }
      img.onerror = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(src)
          return newSet
        })
        setFailedImages(prev => new Set([...prev, src]))
        reject(new Error(`Failed to load image: ${src}`))
      }
      img.src = src
    })
  }

  const preloadImages = async (sources: string[], options?: {
    concurrency?: number
    priority?: 'high' | 'low'
  }) => {
    const { concurrency = 3, priority = 'low' } = options || {}
    
    const chunks = []
    for (let i = 0; i < sources.length; i += concurrency) {
      chunks.push(sources.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      await Promise.allSettled(chunk.map(preloadImage))
      
      // Add delay for low priority preloading
      if (priority === 'low') {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  return {
    preloadImage,
    preloadImages,
    isLoading: (src: string) => loadingImages.has(src),
    isLoaded: (src: string) => loadedImages.has(src),
    hasFailed: (src: string) => failedImages.has(src),
    stats: {
      loading: loadingImages.size,
      loaded: loadedImages.size,
      failed: failedImages.size,
    }
  }
}

export default OptimizedImage
