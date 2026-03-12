import React, { useEffect, useState } from 'react'
import { Skeleton } from './Skeleton'

interface ProgressiveSkeletonProps {
  stages: Array<{
    component: React.ReactNode
    duration: number
    description?: string
  }>
  onStageChange?: (stageIndex: number) => void
  className?: string
}

export const ProgressiveSkeleton: React.FC<ProgressiveSkeletonProps> = ({
  stages,
  onStageChange,
  className = ''
}) => {
  const [currentStage, setCurrentStage] = useState(0)

  useEffect(() => {
    if (currentStage >= stages.length) return

    const timer = setTimeout(() => {
      const nextStage = currentStage + 1
      setCurrentStage(nextStage)
      onStageChange?.(nextStage)
    }, stages[currentStage].duration)

    return () => clearTimeout(timer)
  }, [currentStage, stages, onStageChange])

  if (currentStage >= stages.length) {
    return null // Skeleton completo, mostrar conteúdo real
  }

  return (
    <div className={`progressive-skeleton ${className}`}>
      {stages[currentStage].component}
      {stages[currentStage].description && (
        <div className="mt-2 text-xs text-slate-500 text-center">
          {stages[currentStage].description}
        </div>
      )}
    </div>
  )
}

interface AnimatedSkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  animationType?: 'pulse' | 'wave' | 'shimmer' | 'breathe'
  speed?: 'slow' | 'normal' | 'fast'
  rounded?: boolean
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  animationType = 'pulse',
  speed = 'normal',
  rounded = false
}) => {
  const getAnimationClass = () => {
    const speedMap = {
      slow: '3s',
      normal: '2s',
      fast: '1s'
    }

    switch (animationType) {
      case 'wave':
        return `animate-[wave_${speedMap[speed]}_ease-in-out_infinite]`
      case 'shimmer':
        return `animate-[shimmer_${speedMap[speed]}_ease-in-out_infinite] skeleton-shimmer`
      case 'breathe':
        return `animate-[breathe_${speedMap[speed]}_ease-in-out_infinite]`
      default:
        return `animate-[pulse_${speedMap[speed]}_ease-in-out_infinite]`
    }
  }

  return (
    <div
      className={`bg-slate-200 ${getAnimationClass()} ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
      style={{ width, height }}
    />
  )
}

interface SmartSkeletonProps {
  children: React.ReactNode
  loading: boolean
  skeleton?: React.ReactNode
  delay?: number
  minDuration?: number
  className?: string
}

export const SmartSkeleton: React.FC<SmartSkeletonProps> = ({
  children,
  loading,
  skeleton,
  delay = 0,
  minDuration = 500,
  className = ''
}) => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(true)
        setStartTime(Date.now())
      }, delay)
      
      return () => clearTimeout(timer)
    } else if (startTime && minDuration > 0) {
      const elapsed = Date.now() - startTime
      const remaining = minDuration - elapsed
      
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setShowSkeleton(false)
          setStartTime(null)
        }, remaining)
        
        return () => clearTimeout(timer)
      } else {
        setShowSkeleton(false)
        setStartTime(null)
      }
    } else {
      setShowSkeleton(false)
      setStartTime(null)
    }
  }, [loading, delay, minDuration, startTime])

  if (showSkeleton) {
    return (
      <div className={`smart-skeleton ${className}`}>
        {skeleton || (
          <div className="space-y-3">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton lines={2} />
            <Skeleton height="2rem" width="120px" rounded />
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

interface SkeletonTextProps {
  lines: number
  lineHeight?: string
  lastLineWidth?: string
  className?: string
  shimmer?: boolean
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines,
  lineHeight = '1rem',
  lastLineWidth = '60%',
  className = '',
  shimmer = false
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height={lineHeight}
        width={index === lines - 1 ? lastLineWidth : '100%'}
        shimmer={shimmer}
      />
    ))}
  </div>
)

interface SkeletonButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  width?: string
  className?: string
  shimmer?: boolean
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  variant: _variant = 'primary',
  size = 'md',
  width = 'auto',
  className = '',
  shimmer = false
}) => {
  const heightMap = {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem'
  }

  const widthMap = {
    auto: '120px',
    sm: '80px',
    md: '120px',
    lg: '160px'
  }

  return (
    <Skeleton
      height={heightMap[size]}
      width={width === 'auto' ? widthMap[size] : width}
      rounded
      shimmer={shimmer}
      className={className}
    />
  )
}

interface SkeletonImageProps {
  width?: string | number
  height?: string | number
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2'
  className?: string
  shimmer?: boolean
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = '100%',
  height,
  aspectRatio,
  className = '',
  shimmer = false
}) => {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case '16:9':
        return 'aspect-video'
      case '4:3':
        return 'aspect-[4/3]'
      case '3:2':
        return 'aspect-[3/2]'
      default:
        return ''
    }
  }

  if (aspectRatio) {
    return (
      <div 
        className={`${getAspectRatioClass()} ${className}`}
        style={{ width }}
      >
        <Skeleton
          width="100%"
          height="100%"
          shimmer={shimmer}
        />
      </div>
    )
  }

  return (
    <Skeleton
      width={width}
      height={height || '200px'}
      className={className}
      shimmer={shimmer}
    />
  )
}

interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  shimmer?: boolean
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className = '',
  shimmer = false
}) => {
  const sizeMap = {
    xs: '1.5rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '4rem'
  }

  return (
    <Skeleton
      width={sizeMap[size]}
      height={sizeMap[size]}
      rounded
      shimmer={shimmer}
      className={className}
    />
  )
}

// Skeleton para layouts específicos
export const SkeletonDashboardStats: React.FC<{ shimmer?: boolean }> = ({ shimmer = false }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <SkeletonAvatar size="sm" shimmer={shimmer} />
          <Skeleton width="20px" height="20px" shimmer={shimmer} />
        </div>
        <Skeleton height="2rem" width="60%" className="mb-2" shimmer={shimmer} />
        <Skeleton height="1rem" width="40%" shimmer={shimmer} />
      </div>
    ))}
  </div>
)

export const SkeletonChart: React.FC<{ 
  height?: string 
  shimmer?: boolean 
}> = ({ 
  height = '300px', 
  shimmer = false 
}) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200">
    <div className="flex items-center justify-between mb-6">
      <Skeleton height="1.5rem" width="30%" shimmer={shimmer} />
      <Skeleton width="100px" height="2rem" rounded shimmer={shimmer} />
    </div>
    <Skeleton height={height} className="rounded-lg" shimmer={shimmer} />
    <div className="flex justify-center space-x-6 mt-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton width="12px" height="12px" rounded shimmer={shimmer} />
          <Skeleton width="60px" height="1rem" shimmer={shimmer} />
        </div>
      ))}
    </div>
  </div>
)

// CSS personalizado para animações (deve ser adicionado ao index.css)
export const skeletonAnimations = `
@keyframes wave {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 2s infinite;
}
`
