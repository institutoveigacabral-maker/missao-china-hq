import React, { useState, useRef, useCallback, useEffect } from 'react'
import { SwipeGesture } from './TouchGestures'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TouchCarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  infinite?: boolean
  className?: string
}

export const TouchCarousel: React.FC<TouchCarouselProps> = ({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  infinite = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const totalSlides = children.length

  const goToSlide = useCallback((index: number, smooth: boolean = true) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    let newIndex = index
    
    if (!infinite) {
      newIndex = Math.max(0, Math.min(totalSlides - 1, index))
    } else {
      if (index < 0) {
        newIndex = totalSlides - 1
      } else if (index >= totalSlides) {
        newIndex = 0
      }
    }

    setCurrentIndex(newIndex)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, smooth ? 300 : 0)
  }, [isTransitioning, totalSlides, infinite])

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext()
      }, autoPlayInterval)

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current)
        }
      }
    }
  }, [autoPlay, autoPlayInterval, totalSlides, goToNext])

  // Pause auto play on interaction
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }, [])

  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext()
      }, autoPlayInterval)
    }
  }, [autoPlay, autoPlayInterval, totalSlides, goToNext])

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Main carousel container */}
      <SwipeGesture
        onSwipeLeft={goToNext}
        onSwipeRight={goToPrevious}
        threshold={30}
      >
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </SwipeGesture>

      {/* Navigation arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!infinite && currentIndex === 0}
            className="
              absolute left-2 top-1/2 transform -translate-y-1/2 z-10
              w-10 h-10 bg-white/90 rounded-full shadow-md
              flex items-center justify-center
              touch-feedback hover:bg-white hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            disabled={!infinite && currentIndex === totalSlides - 1}
            className="
              absolute right-2 top-1/2 transform -translate-y-1/2 z-10
              w-10 h-10 bg-white/90 rounded-full shadow-md
              flex items-center justify-center
              touch-feedback hover:bg-white hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  touch-feedback
                  ${index === currentIndex
                    ? 'bg-white scale-125 shadow-md'
                    : 'bg-white/60 hover:bg-white/80'
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de slide individual
export const TouchCarouselSlide: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  )
}
