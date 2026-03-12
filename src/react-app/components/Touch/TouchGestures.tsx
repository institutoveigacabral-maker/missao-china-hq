import React, { useRef, useCallback, useState } from 'react'

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

interface SwipeGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

interface DragGestureProps {
  children: React.ReactNode
  onDragStart?: (position: { x: number; y: number }) => void
  onDragMove?: (position: { x: number; y: number }, delta: { x: number; y: number }) => void
  onDragEnd?: (position: { x: number; y: number }) => void
  dragConstraints?: { left: number; right: number; top: number; bottom: number }
  className?: string
}

interface PinchZoomProps {
  children: React.ReactNode
  onZoomStart?: (scale: number) => void
  onZoomChange?: (scale: number) => void
  onZoomEnd?: (scale: number) => void
  minScale?: number
  maxScale?: number
  className?: string
}

// Hook para detectar gestos de swipe
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) => {
  const touchStart = useRef<TouchPoint | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.timestamp

    // Verificar se foi um swipe rápido
    if (deltaTime > 300) return

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determinar direção do swipe
    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (absDeltaY > threshold && absDeltaY > absDeltaX) {
      if (deltaY > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }

    touchStart.current = null
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

// Componente SwipeGesture
export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = ''
}) => {
  const swipeHandlers = useSwipeGesture(
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold
  )

  return (
    <div
      {...swipeHandlers}
      className={`touch-none ${className}`}
    >
      {children}
    </div>
  )
}

// Hook para detectar gestos de drag
export const useDragGesture = (
  onDragStart?: (position: { x: number; y: number }) => void,
  onDragMove?: (position: { x: number; y: number }, delta: { x: number; y: number }) => void,
  onDragEnd?: (position: { x: number; y: number }) => void,
  constraints?: { left: number; right: number; top: number; bottom: number }
) => {
  const isDragging = useRef(false)
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    
    isDragging.current = true
    startPos.current = position
    lastPos.current = position
    
    onDragStart?.(position)
  }, [onDragStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !lastPos.current) return

    e.preventDefault()
    const touch = e.touches[0]
    let position = { x: touch.clientX, y: touch.clientY }

    // Aplicar constraints se definidas
    if (constraints) {
      position.x = Math.max(constraints.left, Math.min(constraints.right, position.x))
      position.y = Math.max(constraints.top, Math.min(constraints.bottom, position.y))
    }

    const delta = {
      x: position.x - lastPos.current.x,
      y: position.y - lastPos.current.y
    }

    lastPos.current = position
    onDragMove?.(position, delta)
  }, [onDragMove, constraints])

  const handleTouchEnd = useCallback((_e: React.TouchEvent) => {
    if (!isDragging.current || !lastPos.current) return

    isDragging.current = false
    onDragEnd?.(lastPos.current)
    
    startPos.current = null
    lastPos.current = null
  }, [onDragEnd])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Componente DragGesture
export const DragGesture: React.FC<DragGestureProps> = ({
  children,
  onDragStart,
  onDragMove,
  onDragEnd,
  dragConstraints,
  className = ''
}) => {
  const dragHandlers = useDragGesture(
    onDragStart,
    onDragMove,
    onDragEnd,
    dragConstraints
  )

  return (
    <div
      {...dragHandlers}
      className={`touch-none select-none ${className}`}
    >
      {children}
    </div>
  )
}

// Hook para detectar gestos de pinch/zoom
export const usePinchZoom = (
  onZoomStart?: (scale: number) => void,
  onZoomChange?: (scale: number) => void,
  onZoomEnd?: (scale: number) => void,
  minScale: number = 0.5,
  maxScale: number = 3
) => {
  const initialDistance = useRef<number>(0)
  const currentScale = useRef<number>(1)
  const isPinching = useRef(false)

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true
      initialDistance.current = getDistance(e.touches[0], e.touches[1])
      onZoomStart?.(currentScale.current)
    }
  }, [onZoomStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPinching.current || e.touches.length !== 2) return

    e.preventDefault()
    const distance = getDistance(e.touches[0], e.touches[1])
    const scale = Math.max(
      minScale,
      Math.min(maxScale, (distance / initialDistance.current) * currentScale.current)
    )
    
    onZoomChange?.(scale)
  }, [onZoomChange, minScale, maxScale])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isPinching.current && e.touches.length < 2) {
      isPinching.current = false
      onZoomEnd?.(currentScale.current)
    }
  }, [onZoomEnd])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    setScale: (scale: number) => {
      currentScale.current = scale
    }
  }
}

// Componente PinchZoom
export const PinchZoom: React.FC<PinchZoomProps> = ({
  children,
  onZoomStart,
  onZoomChange,
  onZoomEnd,
  minScale = 0.5,
  maxScale = 3,
  className = ''
}) => {
  const [scale, setScale] = useState(1)
  const pinchHandlers = usePinchZoom(
    (s) => {
      onZoomStart?.(s)
    },
    (s) => {
      setScale(s)
      onZoomChange?.(s)
    },
    (s) => {
      onZoomEnd?.(s)
    },
    minScale,
    maxScale
  )

  return (
    <div
      {...pinchHandlers}
      className={`touch-none ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )
}

// Componente combinado para múltiplos gestos
interface MultiGestureProps {
  children: React.ReactNode
  // Swipe gestures
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  // Tap gestures
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  longPressDelay?: number
  className?: string
}

export const MultiGesture: React.FC<MultiGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  onTap,
  onDoubleTap,
  onLongPress,
  longPressDelay = 500,
  className = ''
}) => {
  const touchStart = useRef<TouchPoint | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const lastTap = useRef<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    // Iniciar timer para long press
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress()
      }, longPressDelay)
    }
  }, [onLongPress, longPressDelay])

  const handleTouchMove = useCallback(() => {
    // Cancelar long press se houver movimento
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.timestamp

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Se foi um movimento significativo, tratar como swipe
    if ((absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) && deltaTime < 300) {
      if (absDeltaX > absDeltaY) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      } else {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
    // Se foi um toque pequeno, tratar como tap
    else if (absDeltaX < 10 && absDeltaY < 10 && deltaTime < 300) {
      const now = Date.now()
      const timeSinceLastTap = now - lastTap.current

      if (timeSinceLastTap < 300 && onDoubleTap) {
        // Double tap
        onDoubleTap()
        lastTap.current = 0
      } else {
        // Single tap
        lastTap.current = now
        setTimeout(() => {
          if (lastTap.current === now) {
            onTap?.()
          }
        }, 300)
      }
    }

    touchStart.current = null
  }, [
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    swipeThreshold
  ])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`touch-none select-none ${className}`}
    >
      {children}
    </div>
  )
}
