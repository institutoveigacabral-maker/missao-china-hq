import React, { useState, useRef, useCallback } from 'react'

interface TouchSliderProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  trackClassName?: string
  thumbClassName?: string
  fillClassName?: string
  label?: string
  showValue?: boolean
}

export const TouchSlider: React.FC<TouchSliderProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
  trackClassName = '',
  thumbClassName = '',
  fillClassName = '',
  label,
  showValue = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const sliderRef = useRef<HTMLDivElement>(null)

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current || disabled) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    
    let newValue = min + percentage * (max - min)
    
    // Aplicar step
    if (step > 0) {
      newValue = Math.round(newValue / step) * step
    }
    
    newValue = Math.max(min, Math.min(max, newValue))
    
    setCurrentValue(newValue)
    onChange?.(newValue)
  }, [min, max, step, disabled, onChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }, [disabled, updateValue])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return
    
    e.preventDefault()
    updateValue(e.touches[0].clientX)
  }, [isDragging, disabled, updateValue])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    
    setIsDragging(true)
    updateValue(e.clientX)
  }, [disabled, updateValue])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return
    
    updateValue(e.clientX)
  }, [isDragging, disabled, updateValue])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-gray-500">
              {currentValue}
            </span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className={`
          relative h-2 bg-gray-200 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${trackClassName}
        `}
      >
        {/* Track fill */}
        <div
          className={`
            absolute top-0 left-0 h-full bg-blue-500 rounded-full
            transition-all duration-100
            ${fillClassName}
          `}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full
            transform -translate-y-1/2 transition-all duration-100 shadow-md
            ${isDragging ? 'scale-125 shadow-lg' : ''}
            ${disabled ? 'border-gray-300' : ''}
            ${thumbClassName}
          `}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  )
}
