import React from 'react'

interface StackProps {
  children: React.ReactNode
  spacing?: number
  direction?: 'vertical' | 'horizontal'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  className?: string
}

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 4,
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
}) => {
  const isVertical = direction === 'vertical'
  
  const alignClasses = {
    start: isVertical ? 'items-start' : 'justify-start',
    center: isVertical ? 'items-center' : 'justify-center', 
    end: isVertical ? 'items-end' : 'justify-end',
    stretch: isVertical ? 'items-stretch' : 'justify-stretch',
  }

  const justifyClasses = {
    start: isVertical ? 'justify-start' : 'items-start',
    center: isVertical ? 'justify-center' : 'items-center',
    end: isVertical ? 'justify-end' : 'items-end', 
    between: isVertical ? 'justify-between' : 'items-between',
    around: isVertical ? 'justify-around' : 'items-around',
    evenly: isVertical ? 'justify-evenly' : 'items-evenly',
  }

  const spacingClass = isVertical ? `space-y-${spacing}` : `space-x-${spacing}`

  return (
    <div className={`
      flex ${isVertical ? 'flex-col' : 'flex-row'}
      ${alignClasses[align]}
      ${justifyClasses[justify]}
      ${spacingClass}
      ${wrap ? 'flex-wrap' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Mobile-friendly horizontal scroll
export const MobileHorizontalScroll: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`
      flex space-x-4 overflow-x-auto pb-4
      mobile-scroll
      ${className}
    `}>
      {children}
    </div>
  )
}
