import React from 'react'
import { Spinner } from '../Loading'

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: React.ComponentType<any>
  rightIcon?: React.ComponentType<any>
}

const variantClasses = {
  primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 active:bg-gray-800',
  outline: 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 active:bg-blue-100',
  ghost: 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 active:bg-gray-200',
  danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 active:bg-red-800',
}

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'min-h-touch px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg',
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg border
        touch-feedback transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && <Spinner size="sm" color="white" className="mr-2" />}
      {!loading && LeftIcon && <LeftIcon className="w-4 h-4 mr-2" />}
      
      <span className="truncate">{children}</span>
      
      {!loading && RightIcon && <RightIcon className="w-4 h-4 ml-2" />}
    </button>
  )
}

// Floating Action Button para mobile
export const TouchFAB: React.FC<{
  onClick: () => void
  icon: React.ComponentType<any>
  className?: string
}> = ({ onClick, icon: Icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-20 right-4 z-40
        w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg
        flex items-center justify-center
        touch-feedback hover:bg-blue-700 active:bg-blue-800
        transition-all duration-200 hover:shadow-xl
        lg:hidden
        ${className}
      `}
    >
      <Icon className="w-6 h-6" />
    </button>
  )
}
