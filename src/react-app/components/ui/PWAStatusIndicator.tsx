import React from 'react'
import { WifiOff, Download, AlertCircle, CheckCircle, RotateCw } from 'lucide-react'
import { usePWAStatus } from '../../hooks/usePWAStatus'

interface PWAStatusIndicatorProps {
  variant?: 'compact' | 'detailed'
  showText?: boolean
  className?: string
}

export const PWAStatusIndicator: React.FC<PWAStatusIndicatorProps> = ({
  variant = 'compact',
  showText = true,
  className = ''
}) => {
  const { status, getStatusMessage, getStatusColor } = usePWAStatus()
  
  const getIcon = () => {
    if (!status.isOnline) {
      return <WifiOff className="w-4 h-4" />
    }
    
    if (status.updateAvailable) {
      return <Download className="w-4 h-4" />
    }
    
    if (status.syncInProgress) {
      return <RotateCw className="w-4 h-4 animate-spin" />
    }
    
    if (status.failedActions > 0) {
      return <AlertCircle className="w-4 h-4" />
    }
    
    return <CheckCircle className="w-4 h-4" />
  }

  const getColorClasses = () => {
    const color = getStatusColor()
    const baseClasses = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium'
    
    switch (color) {
      case 'green':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`
      case 'blue':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`
      case 'amber':
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400`
      case 'red':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`${getColorClasses()} ${className}`}>
        {getIcon()}
        {showText && (
          <span className="text-xs">{getStatusMessage()}</span>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Status do App
        </h3>
        <div className={getColorClasses()}>
          {getIcon()}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Conexão:</span>
          <span className={`font-medium ${status.isOnline ? 'text-green-600' : 'text-amber-600'}`}>
            {status.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Instalação:</span>
          <span className={`font-medium ${status.isInstalled ? 'text-green-600' : 'text-gray-600'}`}>
            {status.isInstalled ? 'Instalado' : 'Browser'}
          </span>
        </div>
        
        {status.pendingActions > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Pendentes:</span>
            <span className="font-medium text-blue-600">
              {status.pendingActions} ação{status.pendingActions !== 1 ? 'ões' : ''}
            </span>
          </div>
        )}
        
        {status.failedActions > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Falharam:</span>
            <span className="font-medium text-red-600">
              {status.failedActions} ação{status.failedActions !== 1 ? 'ões' : ''}
            </span>
          </div>
        )}
        
        {status.lastSync && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Última sync:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {status.lastSync.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>
      
      {status.updateAvailable && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Download className="w-4 h-4" />
            <span>Atualização disponível</span>
          </div>
        </div>
      )}
    </div>
  )
}
