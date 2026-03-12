import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  padding?: boolean
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  padding = true,
}) => {
  return (
    <div className={`
      w-full mx-auto
      ${sizeClasses[size]}
      ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Mobile-first responsive container
export const MobileContainer: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`
      mobile-container
      min-h-screen bg-gray-50
      lg:bg-white lg:min-h-0
      ${className}
    `}>
      {children}
    </div>
  )
}
