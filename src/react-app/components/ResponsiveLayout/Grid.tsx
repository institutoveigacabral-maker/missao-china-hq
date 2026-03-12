import React from 'react'

interface GridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export const ResponsiveGrid: React.FC<GridProps> = ({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 4,
  className = '',
}) => {
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2', 
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const gapClass = `gap-${gap}`

  const responsiveClasses = [
    cols.default && gridCols[cols.default],
    cols.sm && `sm:${gridCols[cols.sm]}`,
    cols.md && `md:${gridCols[cols.md]}`,
    cols.lg && `lg:${gridCols[cols.lg]}`,
    cols.xl && `xl:${gridCols[cols.xl]}`,
  ].filter(Boolean).join(' ')

  return (
    <div className={`
      grid ${responsiveClasses} ${gapClass}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Mobile-optimized card grid
export const MobileCardGrid: React.FC<{ 
  children: React.ReactNode 
  className?: string 
}> = ({ children, className = '' }) => {
  return (
    <div className={`
      mobile-grid
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
      ${className}
    `}>
      {children}
    </div>
  )
}
