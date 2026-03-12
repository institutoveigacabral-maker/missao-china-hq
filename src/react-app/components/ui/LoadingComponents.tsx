import React from 'react'
import { Loader2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

// Re-export enhanced Spinner components
export { 
  Spinner, 
  SpinnerOverlay, 
  SpinnerInline, 
  SpinnerPulse,
  SpinnerButton,
  SpinnerWithDots,
  SpinnerCard,
  SpinnerSection
} from './Spinner'

// Re-export LoadingButton components
export { 
  LoadingButton as NewLoadingButton,
  EnhancedLoadingButton,
  PrimaryLoadingButton,
  SecondaryLoadingButton,
  OutlineLoadingButton,
  GhostLoadingButton,
  PulseLoadingButton
} from './LoadingButton'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  }
  
  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`} 
      aria-label="Carregando"
    />
  )
}

interface LoadingDotsProps {
  color?: string
  className?: string
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  color = 'bg-blue-600',
  className = '' 
}) => {
  return (
    <div className={`flex space-x-1 ${className}`} aria-label="Carregando">
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce`}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce delay-100`}></div>
      <div className={`w-2 h-2 ${color} rounded-full animate-bounce delay-200`}></div>
    </div>
  )
}

interface LoadingPulseProps {
  children: React.ReactNode
  className?: string
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({ children, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  )
}

interface LoadingProgressProps {
  progress: number
  showPercentage?: boolean
  color?: string
  className?: string
  label?: string
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ 
  progress, 
  showPercentage = true,
  color = 'bg-blue-600',
  className = '',
  label
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          {showPercentage && <span>{clampedProgress.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  lines?: number
  className?: string
  width?: string
  height?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  lines = 3,
  className = '',
  width = 'w-full',
  height = 'h-4'
}) => {
  return (
    <div className={`animate-pulse ${className}`} aria-label="Carregando conteúdo">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`bg-gray-200 rounded ${width} ${height} mb-2 last:mb-0`}
          style={{
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  )
}

interface LoadingCardSkeletonProps {
  className?: string
}

export const LoadingCardSkeleton: React.FC<LoadingCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  show: boolean
  message?: string
  className?: string
  children?: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  show, 
  message = 'Carregando...',
  className = '',
  children 
}) => {
  if (!show) return null
  
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-700 text-center font-medium">{message}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  state: 'loading' | 'success' | 'error' | 'idle'
  loadingText?: string
  successText?: string
  errorText?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  state,
  loadingText = 'Carregando...',
  successText = 'Concluído!',
  errorText = 'Erro ao carregar',
  className = ''
}) => {
  const states = {
    loading: {
      icon: <LoadingSpinner color="blue" />,
      text: loadingText,
      color: 'text-blue-600'
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      text: successText,
      color: 'text-green-600'
    },
    error: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      text: errorText,
      color: 'text-red-600'
    },
    idle: {
      icon: <Clock className="w-6 h-6 text-gray-400" />,
      text: 'Aguardando...',
      color: 'text-gray-400'
    }
  }
  
  const currentState = states[state]
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {currentState.icon}
      <span className={`font-medium ${currentState.color}`}>
        {currentState.text}
      </span>
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading && (
        <LoadingSpinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          color={variant === 'outline' ? 'gray' : 'blue'}
          className="mr-2" 
        />
      )}
      {children}
    </button>
  )
}

// Componente para loading com delay (evita flicker)
interface DelayedLoadingProps {
  show: boolean
  delay?: number
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const DelayedLoading: React.FC<DelayedLoadingProps> = ({
  show,
  delay = 200,
  children,
  fallback = null
}) => {
  const [shouldShow, setShouldShow] = React.useState(false)
  
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (show) {
      timeoutId = setTimeout(() => setShouldShow(true), delay)
    } else {
      setShouldShow(false)
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [show, delay])
  
  if (show && shouldShow) {
    return <>{children}</>
  }
  
  if (show && !shouldShow) {
    return <>{fallback}</>
  }
  
  return null
}
