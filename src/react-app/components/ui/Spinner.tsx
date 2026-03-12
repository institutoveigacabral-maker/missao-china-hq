import React from 'react'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray' | 'green' | 'red' | 'yellow' | 'purple' | 'cyan'
  className?: string
}

interface SpinnerOverlayProps {
  message?: string
  show?: boolean
  onClose?: () => void
}

interface SpinnerInlineProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const colorClasses = {
  blue: 'text-blue-600',
  white: 'text-white',
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  cyan: 'text-cyan-600',
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Carregando"
    />
  )
}

export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ 
  message, 
  show = true,
  onClose 
}) => {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-6 mx-4 max-w-sm w-full">
        <Spinner size="lg" color="blue" />
        {message && (
          <p className="text-slate-700 font-medium text-center leading-relaxed">
            {message}
          </p>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}

export const SpinnerInline: React.FC<SpinnerInlineProps> = ({ 
  message, 
  size = 'md' 
}) => (
  <div className="flex items-center justify-center space-x-3 p-4">
    <Spinner size={size} color="blue" />
    {message && (
      <span className="text-slate-600 font-medium">{message}</span>
    )}
  </div>
)

// Spinner com pulso para indicar atividade contínua
export const SpinnerPulse: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      <div 
        className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} opacity-20 animate-ping rounded-full`}
        style={{ animationDuration: '2s' }}
      />
    </div>
  )
}

// Spinner para botões
export const SpinnerButton: React.FC<{ size?: 'sm' | 'md' }> = ({ 
  size = 'sm' 
}) => (
  <Spinner 
    size={size} 
    color="white" 
    className="mr-2" 
  />
)

// Spinner com texto de carregamento dinâmico
export const SpinnerWithDots: React.FC<{ 
  baseMessage?: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ 
  baseMessage = 'Carregando', 
  size = 'md' 
}) => {
  const [dots, setDots] = React.useState('')
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <Spinner size={size} color="blue" />
      <span className="text-slate-600 font-medium min-w-[120px]">
        {baseMessage}{dots}
      </span>
    </div>
  )
}

// Spinner para cards pequenos
export const SpinnerCard: React.FC<{ 
  title?: string
  description?: string
}> = ({ 
  title = 'Carregando...', 
  description 
}) => (
  <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-4">
    <Spinner size="lg" color="blue" />
    <div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600">{description}</p>
      )}
    </div>
  </div>
)

// Spinner para seções da página
export const SpinnerSection: React.FC<{ 
  height?: string
  message?: string
}> = ({ 
  height = 'h-48', 
  message = 'Carregando conteúdo...' 
}) => (
  <div className={`${height} bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center space-y-4`}>
    <Spinner size="lg" color="blue" />
    <p className="text-slate-600 font-medium">{message}</p>
  </div>
)

export default Spinner
