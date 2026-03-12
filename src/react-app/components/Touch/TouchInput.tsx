import React, { useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'

interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ComponentType<any>
  rightIcon?: React.ComponentType<any>
  clearable?: boolean
  onClear?: () => void
  multiline?: boolean
  rows?: number
}

export const TouchInput: React.FC<TouchInputProps> = ({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  clearable = false,
  onClear,
  type = 'text',
  value,
  className = '',
  multiline = false,
  rows = 3,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const hasValue = value && value.toString().length > 0

  if (multiline) {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <textarea
          {...(props as any)}
          value={value}
          rows={rows}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e as any)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e as any)
          }}
          className={`
            w-full p-4 text-base
            border rounded-lg transition-all duration-200
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : isFocused 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${error ? 'bg-red-50' : 'bg-white'}
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            resize-none
          `}
        />
        
        {(error || helperText) && (
          <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <LeftIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          {...props}
          type={inputType}
          value={value}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={`
            w-full min-h-touch px-4 py-3 text-base
            border rounded-lg transition-all duration-200
            ${LeftIcon ? 'pl-11' : ''}
            ${(RightIcon || isPassword || (clearable && hasValue)) ? 'pr-11' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : isFocused 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${error ? 'bg-red-50' : 'bg-white'}
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {clearable && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="touch-feedback text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="touch-feedback text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {RightIcon && !isPassword && !clearable && (
            <RightIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

// TextArea otimizada para touch
export const TouchTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  helperText?: string
}> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        {...props}
        className={`
          w-full min-h-[100px] p-4 text-base
          border rounded-lg transition-all duration-200
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500'
          }
          ${error ? 'bg-red-50' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-opacity-20
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-none
          ${className}
        `}
      />
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
