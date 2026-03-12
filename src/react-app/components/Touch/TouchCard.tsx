import React from 'react'

interface TouchCardProps {
  children: React.ReactNode
  onClick?: () => void
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',  
  lg: 'p-6',
}

const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

export const TouchCard: React.FC<TouchCardProps> = ({
  children,
  onClick,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  className = '',
}) => {
  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${isClickable ? 'cursor-pointer touch-feedback' : ''}
        ${hover && isClickable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Lista de cards otimizada para mobile
export const TouchCardList: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`
      space-y-3 sm:space-y-4
      ${className}
    `}>
      {children}
    </div>
  )
}
