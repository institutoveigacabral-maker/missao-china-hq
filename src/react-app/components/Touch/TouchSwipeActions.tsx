import React, { useState, useRef, useCallback } from 'react'
import { useDragGesture } from './TouchGestures'
import { Trash2, Edit, Star, Archive, MoreHorizontal } from 'lucide-react'

interface SwipeAction {
  id: string
  label: string
  icon: React.ComponentType<any>
  color: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
  onAction: () => void
}

interface TouchSwipeActionsProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  threshold?: number
  className?: string
  onSwipeStart?: () => void
  onSwipeEnd?: () => void
}

const colorClasses = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  gray: 'bg-gray-500 text-white'
}

export const TouchSwipeActions: React.FC<TouchSwipeActionsProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 60,
  className = '',
  onSwipeStart,
  onSwipeEnd
}) => {
  const [offsetX, setOffsetX] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxLeftOffset = leftActions.length * 80
  const maxRightOffset = rightActions.length * 80

  const dragHandlers = useDragGesture(
    (_position) => {
      setIsActive(true)
      onSwipeStart?.()
    },
    (_position, delta) => {
      const newOffset = offsetX + delta.x
      
      // Aplicar limites e efeito de resistência
      let finalOffset = newOffset
      
      if (newOffset > maxLeftOffset) {
        const excess = newOffset - maxLeftOffset
        finalOffset = maxLeftOffset + excess * 0.3
      } else if (newOffset < -maxRightOffset) {
        const excess = Math.abs(newOffset + maxRightOffset)
        finalOffset = -maxRightOffset - excess * 0.3
      }
      
      setOffsetX(finalOffset)
    },
    () => {
      setIsActive(false)
      onSwipeEnd?.()
      
      // Snap to position based on threshold
      if (offsetX > threshold && leftActions.length > 0) {
        setOffsetX(Math.min(maxLeftOffset, 80 * Math.ceil(offsetX / 80)))
      } else if (offsetX < -threshold && rightActions.length > 0) {
        setOffsetX(Math.max(-maxRightOffset, -80 * Math.ceil(Math.abs(offsetX) / 80)))
      } else {
        setOffsetX(0)
      }
    }
  )

  const handleActionClick = useCallback((action: SwipeAction) => {
    action.onAction()
    setOffsetX(0) // Reset position after action
  }, [])

  const resetPosition = useCallback(() => {
    setOffsetX(0)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div
          className="absolute left-0 top-0 h-full flex"
          style={{
            transform: `translateX(${Math.min(0, offsetX - maxLeftOffset)}px)`,
          }}
        >
          {leftActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                w-20 h-full flex flex-col items-center justify-center
                ${colorClasses[action.color]}
                touch-feedback active:scale-95
                transition-transform duration-150
              `}
            >
              <action.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div
          className="absolute right-0 top-0 h-full flex"
          style={{
            transform: `translateX(${Math.max(0, offsetX + maxRightOffset)}px)`,
          }}
        >
          {rightActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                w-20 h-full flex flex-col items-center justify-center
                ${colorClasses[action.color]}
                touch-feedback active:scale-95
                transition-transform duration-150
              `}
            >
              <action.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        {...dragHandlers}
        className={`
          relative z-10 bg-white
          transition-transform duration-200 ease-out
          ${isActive ? '' : 'transition-transform'}
        `}
        style={{
          transform: `translateX(${offsetX}px)`,
        }}
        onClick={offsetX !== 0 ? resetPosition : undefined}
      >
        {children}
      </div>
    </div>
  )
}

// Exemplo de uso com actions pré-definidas
export const createSwipeActions = {
  delete: (onDelete: () => void): SwipeAction => ({
    id: 'delete',
    label: 'Excluir',
    icon: Trash2,
    color: 'red',
    onAction: onDelete
  }),
  
  edit: (onEdit: () => void): SwipeAction => ({
    id: 'edit',
    label: 'Editar',
    icon: Edit,
    color: 'blue',
    onAction: onEdit
  }),
  
  favorite: (onFavorite: () => void): SwipeAction => ({
    id: 'favorite',
    label: 'Favoritar',
    icon: Star,
    color: 'yellow',
    onAction: onFavorite
  }),
  
  archive: (onArchive: () => void): SwipeAction => ({
    id: 'archive',
    label: 'Arquivar',
    icon: Archive,
    color: 'gray',
    onAction: onArchive
  }),
  
  more: (onMore: () => void): SwipeAction => ({
    id: 'more',
    label: 'Mais',
    icon: MoreHorizontal,
    color: 'gray',
    onAction: onMore
  })
}
