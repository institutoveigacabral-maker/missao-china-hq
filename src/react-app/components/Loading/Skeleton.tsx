import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  lines?: number
  animate?: boolean
  shimmer?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
  lines = 1,
  animate = true,
  shimmer = false,
}) => {
  const skeletonClass = `${animate ? 'animate-pulse' : ''} ${shimmer ? 'skeleton-shimmer' : ''} bg-slate-200 ${
    rounded ? 'rounded-full' : 'rounded'
  } ${className}`
  
  if (lines === 1) {
    return (
      <div
        className={skeletonClass}
        style={{ width, height }}
        aria-label="Carregando conteúdo"
      />
    )
  }

  return (
    <div className="space-y-2" aria-label="Carregando múltiplas linhas">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={skeletonClass}
          style={{ 
            width: index === lines - 1 ? `${Math.random() * 40 + 60}%` : width, 
            height 
          }}
        />
      ))}
    </div>
  )
}

// Skeletons pré-definidos para componentes comuns
export const SkeletonCard: React.FC<{ 
  variant?: 'default' | 'product' | 'profile' | 'article' | 'compact' | 'detailed'
  shimmer?: boolean
}> = ({ 
  variant = 'default',
  shimmer = false 
}) => {
  switch (variant) {
    case 'product':
      return (
        <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-white">
          <Skeleton height="200px" className="rounded-lg" shimmer={shimmer} />
          <div className="space-y-2">
            <Skeleton height="1.5rem" width="80%" shimmer={shimmer} />
            <Skeleton height="1rem" width="60%" shimmer={shimmer} />
            <div className="flex justify-between items-center mt-4">
              <Skeleton height="1.25rem" width="40%" shimmer={shimmer} />
              <Skeleton height="2rem" width="80px" rounded shimmer={shimmer} />
            </div>
          </div>
        </div>
      )
    
    case 'profile':
      return (
        <div className="border border-slate-200 rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-center space-x-4">
            <Skeleton width="4rem" height="4rem" rounded shimmer={shimmer} />
            <div className="space-y-2 flex-1">
              <Skeleton height="1.25rem" width="70%" shimmer={shimmer} />
              <Skeleton height="1rem" width="50%" shimmer={shimmer} />
            </div>
          </div>
          <Skeleton lines={3} height="1rem" shimmer={shimmer} />
        </div>
      )
    
    case 'article':
      return (
        <div className="border border-slate-200 rounded-lg p-6 space-y-4 bg-white">
          <Skeleton height="1.75rem" width="90%" shimmer={shimmer} />
          <Skeleton height="200px" className="rounded-lg" shimmer={shimmer} />
          <Skeleton lines={4} height="1rem" shimmer={shimmer} />
          <div className="flex items-center space-x-4 pt-4">
            <Skeleton width="2rem" height="2rem" rounded shimmer={shimmer} />
            <Skeleton height="1rem" width="30%" shimmer={shimmer} />
            <Skeleton height="1rem" width="20%" shimmer={shimmer} />
          </div>
        </div>
      )
      
    case 'compact':
      return (
        <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-white">
          <div className="flex items-center space-x-3">
            <Skeleton width="2.5rem" height="2.5rem" rounded shimmer={shimmer} />
            <div className="flex-1 space-y-1">
              <Skeleton height="1rem" width="70%" shimmer={shimmer} />
              <Skeleton height="0.875rem" width="50%" shimmer={shimmer} />
            </div>
          </div>
        </div>
      )
      
    case 'detailed':
      return (
        <div className="border border-slate-200 rounded-lg p-6 space-y-6 bg-white">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton height="1.5rem" width="60%" shimmer={shimmer} />
              <Skeleton height="1rem" width="80%" shimmer={shimmer} />
            </div>
            <Skeleton width="3rem" height="1.5rem" rounded shimmer={shimmer} />
          </div>
          <Skeleton height="150px" className="rounded-lg" shimmer={shimmer} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton height="1rem" width="40%" shimmer={shimmer} />
              <Skeleton height="1.25rem" width="60%" shimmer={shimmer} />
            </div>
            <div className="space-y-2">
              <Skeleton height="1rem" width="40%" shimmer={shimmer} />
              <Skeleton height="1.25rem" width="60%" shimmer={shimmer} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Skeleton height="2rem" width="100px" rounded shimmer={shimmer} />
            <Skeleton height="2rem" width="120px" rounded shimmer={shimmer} />
          </div>
        </div>
      )
    
    default:
      return (
        <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white">
          <Skeleton height="1.5rem" width="60%" shimmer={shimmer} />
          <Skeleton lines={2} height="1rem" shimmer={shimmer} />
          <div className="flex space-x-2">
            <Skeleton width="80px" height="2rem" rounded shimmer={shimmer} />
            <Skeleton width="80px" height="2rem" rounded shimmer={shimmer} />
          </div>
        </div>
      )
  }
}

export const SkeletonTable: React.FC<{ 
  rows?: number 
  cols?: number
  hasHeader?: boolean
  className?: string
  shimmer?: boolean
}> = ({ 
  rows = 5, 
  cols = 4,
  hasHeader = true,
  className = '',
  shimmer = false
}) => (
  <div className={`space-y-3 ${className}`}>
    {/* Header */}
    {hasHeader && (
      <div className="grid gap-4 border-b border-slate-200 pb-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={`header-${index}`} height="2rem" className="bg-slate-300" shimmer={shimmer} />
        ))}
      </div>
    )}
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4 py-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1.5rem" shimmer={shimmer} />
        ))}
      </div>
    ))}
  </div>
)

export const SkeletonList: React.FC<{ 
  items?: number
  variant?: 'simple' | 'detailed' | 'media'
  className?: string
  shimmer?: boolean
}> = ({ 
  items = 6,
  variant = 'simple',
  className = '',
  shimmer = false
}) => {
  const renderItem = (index: number) => {
    switch (variant) {
      case 'detailed':
        return (
          <div key={index} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
            <Skeleton width="3.5rem" height="3.5rem" rounded shimmer={shimmer} />
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="80%" shimmer={shimmer} />
              <Skeleton height="1rem" width="60%" shimmer={shimmer} />
              <Skeleton height="0.875rem" width="40%" shimmer={shimmer} />
              <div className="flex space-x-2 pt-2">
                <Skeleton width="60px" height="1.5rem" rounded shimmer={shimmer} />
                <Skeleton width="80px" height="1.5rem" rounded shimmer={shimmer} />
              </div>
            </div>
          </div>
        )
      
      case 'media':
        return (
          <div key={index} className="flex items-center space-x-4 p-3 border border-slate-200 rounded-lg">
            <Skeleton width="5rem" height="5rem" className="rounded-lg" shimmer={shimmer} />
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="70%" shimmer={shimmer} />
              <Skeleton height="1rem" width="90%" shimmer={shimmer} />
              <Skeleton height="0.875rem" width="50%" shimmer={shimmer} />
            </div>
            <div className="text-right space-y-2">
              <Skeleton width="4rem" height="1rem" shimmer={shimmer} />
              <Skeleton width="3rem" height="1.5rem" rounded shimmer={shimmer} />
            </div>
          </div>
        )
      
      default:
        return (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton width="3rem" height="3rem" rounded shimmer={shimmer} />
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="70%" shimmer={shimmer} />
              <Skeleton height="1rem" width="50%" shimmer={shimmer} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => renderItem(index))}
    </div>
  )
}

export const SkeletonGrid: React.FC<{
  items?: number
  columns?: number
  className?: string
}> = ({ 
  items = 8,
  columns = 4,
  className = ''
}) => (
  <div 
    className={`grid gap-6 ${className}`}
    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
  >
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index} variant="product" />
    ))}
  </div>
)

export const SkeletonForm: React.FC<{
  fields?: number
  hasSubmit?: boolean
  className?: string
}> = ({
  fields = 5,
  hasSubmit = true,
  className = ''
}) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton height="1rem" width="30%" />
        <Skeleton height="2.5rem" className="rounded-md" />
      </div>
    ))}
    
    {hasSubmit && (
      <div className="flex space-x-3 pt-4">
        <Skeleton width="120px" height="2.5rem" rounded />
        <Skeleton width="100px" height="2.5rem" rounded />
      </div>
    )}
  </div>
)

export const SkeletonDashboard: React.FC<{
  className?: string
}> = ({ className = '' }) => (
  <div className={`space-y-8 ${className}`}>
    {/* Header Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="space-y-3">
            <Skeleton height="1rem" width="60%" />
            <Skeleton height="2rem" width="40%" />
            <Skeleton height="0.875rem" width="80%" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Chart Area */}
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <Skeleton height="1.5rem" width="30%" className="mb-4" />
      <Skeleton height="300px" className="rounded-lg" />
    </div>
    
    {/* Data Table */}
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <Skeleton height="1.5rem" width="25%" />
      </div>
      <SkeletonTable rows={6} cols={5} hasHeader={true} className="p-6" />
    </div>
  </div>
)

export const SkeletonNavigation: React.FC<{
  items?: number
  className?: string
}> = ({
  items = 6,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-2">
        <Skeleton width="1.5rem" height="1.5rem" />
        <Skeleton height="1rem" width="70%" />
      </div>
    ))}
  </div>
)

// Skeleton com shimmer effect personalizado
export const SkeletonShimmer: React.FC<SkeletonProps> = (props) => (
  <div className="relative overflow-hidden">
    <Skeleton {...props} animate={false} className={`${props.className} bg-slate-200`} />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
)

// HOC para aplicar skeleton a qualquer componente
export const withSkeleton = <P extends object>(
  Component: React.ComponentType<P>,
  SkeletonComponent: React.ComponentType = () => <Skeleton lines={3} />
) => {
  return React.forwardRef<any, P & { isLoading?: boolean }>((props, ref) => {
    const { isLoading, ...componentProps } = props
    
    if (isLoading) {
      return <SkeletonComponent />
    }
    
    return <Component ref={ref} {...(componentProps as P)} />
  })
}

// Estilos CSS para shimmer effect (adicionar ao index.css)
export const shimmerCSS = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`
