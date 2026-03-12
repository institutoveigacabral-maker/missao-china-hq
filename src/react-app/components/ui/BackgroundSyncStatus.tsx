import React from 'react'
import { Wifi, WifiOff, Clock, AlertTriangle, CheckCircle, Loader2, Trash2, RefreshCw } from 'lucide-react'
import { useBackgroundSync } from '../../utils/backgroundSync'

interface BackgroundSyncStatusProps {
  compact?: boolean
  showDetails?: boolean
}

export const BackgroundSyncStatus: React.FC<BackgroundSyncStatusProps> = ({ 
  compact = false, 
  showDetails = true 
}) => {
  const { queueStatus, isOnline, performSync, clearFailed, updateStatus } = useBackgroundSync()

  // Auto-refresh status every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(updateStatus, 5000)
    return () => clearInterval(interval)
  }, [updateStatus])

  const handleManualSync = async () => {
    try {
      await performSync()
      await updateStatus()
    } catch (error) {
      console.error('Manual sync failed:', error)
    }
  }

  const handleClearFailed = async () => {
    try {
      await clearFailed()
    } catch (error) {
      console.error('Clear failed actions error:', error)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        
        {queueStatus.total > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-500" />
            <span className="text-xs text-gray-600">{queueStatus.pending}</span>
          </div>
        )}
        
        {queueStatus.failed > 0 && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span className="text-xs text-red-600">{queueStatus.failed}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sincronização</h3>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3">
          {/* Queue Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-sm font-medium text-blue-900">Total</div>
              <div className="text-xl font-bold text-blue-600">{queueStatus.total}</div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-sm font-medium text-amber-900">Pendentes</div>
              <div className="text-xl font-bold text-amber-600">{queueStatus.pending}</div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Loader2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-sm font-medium text-green-900">Sincronizando</div>
              <div className="text-xl font-bold text-green-600">{queueStatus.syncing}</div>
            </div>

            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-sm font-medium text-red-900">Falharam</div>
              <div className="text-xl font-bold text-red-600">{queueStatus.failed}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleManualSync}
              disabled={!isOnline || queueStatus.syncing > 0}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Sincronizar Agora
            </button>

            {queueStatus.failed > 0 && (
              <button
                onClick={handleClearFailed}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Falhas
              </button>
            )}
          </div>

          {/* Status Messages */}
          {!isOnline && queueStatus.pending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {queueStatus.pending} ações serão sincronizadas quando a conexão retornar.
                </span>
              </div>
            </div>
          )}

          {queueStatus.failed > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {queueStatus.failed} ações falharam após múltiplas tentativas. Verifique sua conexão e tente novamente.
                </span>
              </div>
            </div>
          )}

          {queueStatus.total === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Todos os dados estão sincronizados.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BackgroundSyncStatus
