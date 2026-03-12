import React from 'react'
import { Spinner } from './Spinner'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 disabled:hover:bg-blue-400',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent',
  ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-gray-400 disabled:hover:bg-transparent',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = loading || disabled

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading && (
        <Spinner 
          size="sm" 
          color={variant === 'outline' || variant === 'ghost' ? 'blue' : 'white'}
          className="mr-2"
        />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  )
}

// Enhanced LoadingButton with more features
interface EnhancedLoadingButtonProps extends LoadingButtonProps {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loadingIcon?: React.ReactNode
  fullWidth?: boolean
  shadow?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

export const EnhancedLoadingButton: React.FC<EnhancedLoadingButtonProps> = ({
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loadingIcon,
  fullWidth = false,
  shadow = false,
  rounded = 'md',
  disabled,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = loading || disabled

  const baseClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${fullWidth ? 'w-full' : ''}
    ${shadow ? 'shadow-md hover:shadow-lg' : ''}
    ${className}
  `

  const renderIcon = (position: 'left' | 'right') => {
    if (loading && position === 'left') {
      return loadingIcon || (
        <Spinner 
          size="sm" 
          color={variant === 'outline' || variant === 'ghost' ? (isDisabled ? 'gray' : 'blue') : 'white'}
          className="mr-2"
        />
      )
    }
    
    if (icon && iconPosition === position && !loading) {
      return (
        <span className={position === 'left' ? 'mr-2' : 'ml-2'}>
          {icon}
        </span>
      )
    }
    
    return null
  }

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={baseClasses}
    >
      {renderIcon('left')}
      {loading && loadingText ? loadingText : children}
      {renderIcon('right')}
    </button>
  )
}

// Specialized button variants
export const PrimaryLoadingButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton variant="primary" {...props} />
)

export const SecondaryLoadingButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton variant="secondary" {...props} />
)

export const OutlineLoadingButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton variant="outline" {...props} />
)

export const GhostLoadingButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton variant="ghost" {...props} />
)

// Button with pulse animation when loading
export const PulseLoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  className = '',
  ...props
}) => (
  <LoadingButton
    loading={loading}
    className={`${loading ? 'animate-pulse' : ''} ${className}`}
    {...props}
  />
)

export default LoadingButton
